import { Component, OnInit, Input, Output, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { ComposeService } from '../../../../services/compose.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { UserService } from '../../../../services/user.service';
import { ENV } from '../../../../env.config';

@Component({
  selector: 'app-client-comments',
  templateUrl: './client-comments.component.html',
  styleUrls: ['./client-comments.component.css']
})
export class ClientCommentsComponent implements OnInit {

  @Input('data') comment: any;
  public  id: number;
  public routeSub: any;
  public loading: boolean = false;
  public finished: boolean = true;
  public comments = [];
  public serverURL = ENV.SERVER_URL;
  public showForm = {};
  public replyFor = null;
  public change = false;
  public insightsData1 = []
  public insightsData2 = []
  public whenPageLoad: boolean = true;
  public isPushed: boolean = false;
  public objLen: number = 40;
  public  dtOptions = {
    "draw": 1,
    "order":
      [
        { "column": "createdAt", "dir": "desc" }
      ],
    "start": 0,
    "length": this.objLen,
  };


  @Output() UpdateComments: EventEmitter<any> = new EventEmitter<any>();
  @Output() SelfUpdateComment: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private _composeapi: ComposeService,
    private route: ActivatedRoute,
    private _utils: UtilsService,
    private _userapi: UserService,
  ) {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      });
  }

  ngOnInit() {
    this.change = true;
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

