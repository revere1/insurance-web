import { Component, OnInit, Input, Output, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { ComposeService } from '../../../services/compose.service';
import { NotificationService } from '../../../services/notifications.service';
import { InsightService } from '../../../services/insights/insight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { UserService } from '../../../services/user.service';
import { FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ENV } from '../../../env.config';

@Component({
  selector: 'app-editorier-comments',
  templateUrl: './editorier-comments.component.html',
  styleUrls: ['./editorier-comments.component.css']
})
export class EditorierCommentsComponent implements OnInit {

  @Input('data') comment: any;
  @Output() UpdateComments: EventEmitter<any> = new EventEmitter<any>();
  @Output() SelfUpdateComment: EventEmitter<any> = new EventEmitter<any>();
  id: number;
  routeSub: any;
  loading: boolean = false;
  finished: boolean = true;
  public comments = [];
  public serverURL = ENV.SERVER_URL;
  public showForm = {};
  public replyFor = null;
  chg = false;
  whenPageLoad: boolean = true;
  isPushed: boolean = false;


  constructor(
    private _route: ActivatedRoute,
  ) {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
  }

  ngOnInit() {
    this.chg = true;
  }

  switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }

  replyToUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }

  selfUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }

}
