import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ENV } from '../../env.config';
import { MessagesService } from '../../services/messages.service';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
declare var $: any;
@Component({
  selector: 'app-message-form-list',
  templateUrl: './message-form-list.component.html',
  styleUrls: ['./message-form-list.component.css']
})

export class MessageFormListComponent implements OnInit {

  private routeSub: Subscription;
  private msgId: number;
  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private apiEvents = [];
  private objLen: number = 5;
  private dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "message", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "subject", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "first_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "last_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
    ],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": this.currentUserId,
    "search": { "value": "", "regex": false }
  };
  private finished = false  // boolean when end of database is reached
  public error: boolean;
  public usersList = [];
  public switch: string = '';
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public messages = [];
  public replyMessage = [];
  public userprofile: any;
  public id: any;

  constructor(private _messagesApi: MessagesService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _userApi: UserService,
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
  ) {
    _auth.loadSession();
  }

  ngOnInit() {
    this._getUser();
    this._onChanges();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserId = currentUser.user.userid;
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id']
        this._messageById(params['id'])
        this._getMessages();
      });
  }

  public msgFilterForm: FormGroup = this._formBuilder.group({
    quickFilter: [''],
  });

  private _messageById(id: any) {
    if (id == '') {
      this.messages = [];
    } else {
      this.replyMessage = [];
      let apiEvent = this._messagesApi.messageById$(id).subscribe(data => {
        if (!data.data.length) {
          this._router.navigateByUrl('/messages/read')
        }
        this.messages = [];
        if (data.success === false) {
        } else {
          let uniqueThreads = [];
          if (data.data) {
            (data.data).forEach(val => {
              if (this._utils.inArray(val.id, uniqueThreads)) {

                let key = this._utils.isKeyExistsForVal(val.id, this.messages);
                if (key !== -1) {
                  (this.messages[key].messageFiles).push({ 'path': val.path, 'orgName': val.orgName });
                }
              }
              else {
                let temp = val;
                temp.messageFiles = val.path ? [{ 'path': val.path, 'orgName': val.orgName }] : [];
                (this.messages).push(temp);
                uniqueThreads.push(val.id);
              }
            })
          }
          this.msgId = this.messages[0].id
        }
      });
      (this.apiEvents).push(apiEvent);
    }
  }

  public refresh(id, index) {
    $(document).ready(() => {
      let that = this
      $('#relistitem' + id).remove();
      $('#countRemove' + index).remove();
      $('#border' + index).removeAttr('style')
      $('#rcount ,#rcounthead').each(function () {
        $(this).text(function (v, n) {
          if (JSON.parse(n) != 0) {
            return JSON.parse(n) - 1;
          } else {
            return 0;
          }
        });
      })
    })
    this._messageById(id);
  }

  private _onChanges() {
    this.msgFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.usersList = [];
        this._getMessages();
        this._getUser();
      });
  }

  private _getUser() {
    this._userApi
      .getUserById$(this.currentUserId)
      .subscribe(
        res => {
          if (res.success) {
            this.userprofile = res.data;
            this.avatar = this.serverURL + this.userprofile.profile_pic;
          }
        },
        err => {
          this.error = true;
        });
  }

  public onScroll() {
    this.dtOptions.start += this.objLen;
    this._getMessages();
  }

  private _getMessages() {
    if (this.finished) return;
    this._messagesApi
      .filterMessages$(this.dtOptions, 'filter-messages')
      .subscribe(data => {
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.usersList = (this.usersList).concat(data.data);
      })
  }

  private _uploadFile(files, editor) {
    {
      const formData = new FormData();
      this._messagesApi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });

    }
  }

  public onNotify(message: string): void {
    this.replyMessage.push(message)
  }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}

