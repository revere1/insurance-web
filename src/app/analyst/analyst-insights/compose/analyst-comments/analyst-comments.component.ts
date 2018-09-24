import { Component, OnInit, Input, Output, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../services/notifications.service';
import { InsightService } from '../../../../services/insights/insight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ENV } from '../../../../env.config';

@Component({
  selector: 'app-analyst-comments',
  templateUrl: './analyst-comments.component.html',
  styleUrls: ['./analyst-comments.component.css']
})
export class AnalystCommentsComponent implements OnInit {

  @Input('data') comment: any;
  @Output() UpdateComments: EventEmitter<any> = new EventEmitter<any>();
  @Output() SelfUpdateComment: EventEmitter<any> = new EventEmitter<any>();
  private id: number;
  private routeSub: any;
  private finished: boolean = true;
  private chg = false;
  private whenPageLoad: boolean = true;
  private isPushed: boolean = false;
  private objLen: number = 40;
  private dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen
  };
  public loading: boolean = false;
  public serverURL = ENV.SERVER_URL;
  public showForm = {};
  public replyFor = null;

  constructor(
    private _route: ActivatedRoute,
    private _utils: UtilsService
  ) {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
  }

  ngOnInit() {
    this.chg = true;
  }

  public switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }

  public replyToUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }

  public selfUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }

}

