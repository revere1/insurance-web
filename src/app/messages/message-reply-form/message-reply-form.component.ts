import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { EventEmitter } from '@angular/core'
import { AdminMessageModel, AdminMessageFormModel } from '../../models/admin-message.module';
import { ENV } from '../../env.config';
import { MessagesService } from '../../services/messages.service';
import { MessagesFormService } from '../../services/messages/messages-form.service';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-message-reply-form',
  templateUrl: './message-reply-form.component.html',
  styleUrls: ['./message-reply-form.component.css']
})
export class MessageReplyFormComponent implements OnInit {

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() event: AdminMessageModel;
  private isEdit: boolean;
  private apiEvents = [];
  // Model storing initial form values
  private formEvent: AdminMessageFormModel;
  private formChangeSub: Subscription;
  // Form submission
  private submitEventObj: AdminMessageModel;
  private submitEventSub: Subscription;
  private routeSub: Subscription;
  private latestMessages: any;
  // Form validation and disabled logic
  public formErrors: any;
  public error: boolean;
  public submitBtnText: string;
  public messageForm: FormGroup;
  public tickerInd = ENV['$'];
  public analystInd = ENV['@'];
  public InsightInd = ENV['#'];
  public id: any;
  public submitting: boolean;
  private tryingToPaste = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _utils: UtilsService,
    private _route: ActivatedRoute,
    private _messagesApi: MessagesService,
    private _messageFormService: MessagesFormService,
    private _auth : AuthService,
    public toastr: ToastsManager
  ) {
    this.messageForm = new FormGroup({
      message: new FormControl()
    });
    _auth.loadSession();
  }

  ngOnInit() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this._latestMessage(params['id'])
      });
    this.formErrors = this._messageFormService.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';
    this.formEvent = this._setFormEvent();
    let _that = this;
    $(document).ready(() => {
      $('#message').summernote({
        toolbar: ENV.SUMMER_SETUP.toolbar,
        callbacks: {
          onPaste: function (e) {
            _that.tryingToPaste = true;
          },
          onImageUpload: function (files) {
            if (_that.tryingToPaste) {
              _that.tryingToPaste = false;
              return false;
            }
            else
              _that._uploadFile(files, this);
          },
          onCreateLink: function (originalLink) {
            return originalLink; // return original link 
          },
         // hint: _that._utils.hint()
        }
      });
    
    });
  }

  private _uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._messagesApi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }

  private_buildForm() {
    let validRules = {
      description: [this.formEvent.message, [
      ]]
    };
    this.messageForm = this._formBuilder.group(validRules);
    //Subscribetoformvaluechanges
    let apiEvent = this.formChangeSub = this.messageForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    (this.apiEvents).push(apiEvent);
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.messageForm);
    }
    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.messageForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this._messageFormService.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        _setErrMsgs(this.messageForm.get(field), this.formErrors, field);
      }
    }
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new AdminMessageFormModel(null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new AdminMessageFormModel(
        this.event.message,
        this.event.parent,
        this.event.is_read,
        this.event.sent_to,
        this.event.sent_from
      );
    }
  }

  private _latestMessage(id: any) {
    if (id == '') {
    } else {
      this._messagesApi.latestMessageById$(id).subscribe(data => {
        if (data.success === false) {
        } else {
          this.latestMessages = data.data;
        }
      });
    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    return new AdminMessageModel(
      $('#message').summernote('code'),
      (this.latestMessages.parent) ? this.latestMessages.parent : this.latestMessages.id,
      0,
      (this.latestMessages.sent_from == currentUser.user.userid) ? this.latestMessages.msgrecipient.sent_to : this.latestMessages.sent_from,
      currentUser.user.userid
    );
  }

  public saveReplyMessage() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._messagesApi
        .postEventForReply$(this.id, this.submitEventObj)
        .subscribe(
          data => {
            this.notify.emit({ 'msg': data.data.message, 'createdAt': data.data.createdAt });
            this._handleSubmitSuccess(data);
          },
          err => this._handleSubmitError(err)
        );
    }
  }
  
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      $("#message").summernote("reset");
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }

}
