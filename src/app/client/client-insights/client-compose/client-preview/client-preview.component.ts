import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ComposeService } from '../../../../services/compose.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComposeModel } from '../../../../models/compose.model';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-client-preview',
  templateUrl: './client-preview.component.html',
  styleUrls: ['./client-preview.component.css']
})
export class ClientPreviewComponent implements OnInit {

  @Input() event: ComposeModel;
  isEdit: boolean;
  insightsData: any;
  public id: number;
  private type: any;
  routeSub: Subscription;
  apiEvents = [];
  finished: boolean = false;
  submitEventObj: ComposeModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  public replyFor = null;
  public showForm = {};
  public showComment = {};
  reply: boolean;
  isPushed: boolean = false;
  insightsData1 = []
  insightsData2 = []
  currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
  whenPageLoad: boolean = true;

  objLen: number = 40;
  private dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
  };

  insightscomments = [];
  switch: string = '';
  onScrollUp() {
    this.dtOptions.start += this.objLen;
    this.finished = false;
    this.getInsightscomments();
    this.finished = true;
  }

  public getInsightscomments(append = true) {
    this._composeapi.getInsightcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.rows.length !== this.objLen) {
        if (!append) this.insightsData1 = [];
        if (data.data.rows.length) {
          this.insightsData2 = (data.data.count);
          data.data.rows = this._utils.list_to_tree(data.data.rows);
          this.insightsData1 = (data.data.rows).concat(this.insightsData1);
        }
        this.finished = true;
      } else {
        if (data.data.rows.length) this.insightsData1 = (data.data.rows).concat(this.insightsData1);
        if (this.whenPageLoad) {
          this.replyFor = ((this.insightsData1).length) ? this.insightsData1[this.insightsData1.length - 1].pcid : null;
          this.whenPageLoad = false;
        }

      }
    });
  }



  constructor(
    private _composeapi: ComposeService,
    private route: ActivatedRoute,
    private _utils: UtilsService,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,

  ) { }

  ngOnInit() {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      });

    let apiEvent = this._composeapi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        this.insightsData = data.data;
        let insViewObj = {
          'insightId': this.insightsData.id,
          'viewedBy': this.currentUser.userid
        }
        this._composeapi.insightView$(insViewObj).subscribe(data => {
          if (data.success === false) {
          } else {
          }
        })
        this.type = this.insightsData.type;
      }
    });
    (this.apiEvents).push(apiEvent);
  }

  update(status) {
    this._composeapi.publishEvent$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
      }
      if (data.success) {
        this.toastr.success(data.message, 'Success');
      }
      else {
        this.toastr.error(data.message, 'Invalid');
      }
    });
  }

  reply1() {
    this.reply = true;
    this.isPushed = true;
  }

  closeAllForms() {
    let t = this._utils.objLen(this.showForm);
    if (t) {
      for (let k in this.showForm) {
        this.showForm[k] = false;
      }
    }
  }


  replyToUpdate(obj = {}) {
    this.replyFor = obj['rid'] || this.replyFor;
    this.closeAllForms();
    this.getInsightscomments(false);
    this.isPushed = false;
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
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

  switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}


