import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpService } from '../../../services/help.service';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ComposeService } from '../../../services/compose.service';
import { CommodityService } from '../../../services/insights/commodity.service';
import { ENV } from './../../../env.config';
import { Router, ActivatedRoute } from '@angular/router';
import { ComposeModel } from '../../../models/compose.model';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notifications.service';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editorier-preview',
  templateUrl: './editorier-preview.component.html',
  styleUrls: ['./editorier-preview.component.css']
})
export class EditorierPreviewComponent implements OnInit {

  @Input() insId: number;
  public ngxData: any = {};
  public submit: boolean;
  public view: any[] = [1200, 500];
  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel = '';
  public showYAxisLabel = true;
  public yAxisLabel = '';
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  // line, area
  autoScale = true;
  public price: any;
  public Headers = [];
  private dataRetrived: boolean = false;
  //<-------charts End ---------/>
  @Input() event: ComposeModel;
  private type: any;
  private routeSub: Subscription;
  private apiEvents = [];
  private editorierId: any;
  private finished: boolean = false;
  private currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
  private objLen: number = 10;
  private dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
  };
  public insightsData: any;
  public id: number;
  public error: boolean;
  public showForm = {};
  public showComment = {};
  public whenPageLoad: boolean = true;
  public insightscomments = []
  public insightscommentsChild = []
  public replyFor = null;
  public reply: boolean;
  public isPushed: boolean = false;
  public submitting: boolean;
  public AdminsList = [];
  public AdminsId = [];
  
  constructor(
    private _composeApi: ComposeService,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _userapi: UserService,
    private _notificationApi: NotificationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _dashbrdApi: DashboardService,
    private _datePipe : DatePipe
  ) { }

  ngOnChanges() {
    this.ngOnInit();
  }

  private _getInsightscomments(append = true) {
    this._composeApi.getInsightcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.rows.length !== this.objLen) {
        if (!append) this.insightscomments = [];
        if (data.data.rows.length) {
          this.insightscommentsChild = (data.data.count);
          data.data.rows = this._utils.list_to_tree(data.data.rows);
          this.insightscomments = (data.data.rows).concat(this.insightscomments);
        }
        this.finished = true;
      } else {
        if (data.data.rows.length) this.insightscomments = (data.data.rows).concat(this.insightscomments);
        if (this.whenPageLoad) {
          this.replyFor = ((this.insightscomments).length) ? this.insightscomments[this.insightscomments.length - 1].pcid : null;
          this.whenPageLoad = false;
        }
      }
    });
  }

  ngOnInit() {
    this.ngxData = {
      data: [
        {
          name: 'api',
          series: []
        }
      ]
    }
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });

    this._userapi.getUserList(1).subscribe(data => {
      if (data.success === false) {
      } else {
        this.AdminsList = data.data
        this.AdminsList.forEach(val => {
          this.AdminsId.push(val.id)
        })
      }
    })
    let apiEvent = this._composeApi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        this.insightsData = data.data;
        this.type = this.insightsData.type;
        if (this.insightsData.ticker != null) {
          this._loadData();
        }
      }
    });
    (this.apiEvents).push(apiEvent);
  }

  public PublishEvent(obj) {
    this._composeApi.publishEvent$(obj).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        if (obj.status == ENV.INSIGHT_STATUSES.PUBLISHED) {
          let obj = {
            'type': this.type,
            'message': '<a href="/insights/preview/' + this.insightsData.id + '">' + this.currentUser.first_name + ' ' + this.currentUser.last_name + ' Published The Insight' + '</a>',
            'from': this.currentUser.userid,
            'to': [this.insightsData.createdBy]
          }
          this._notificationApi.notification(obj).subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
            }
          });
          let adminObj = {
            'type': this.type,
            'message': '<a href="/insights/preview/' + this.insightsData.id + '">' + 'Editorier Published The Insight' + '</a>',
            'from': this.currentUser.userid,
            'to': this.AdminsId
          }
          this._notificationApi.notification(adminObj).subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
              this._router.navigate(['/insights'])
            }
          });
        }
        if (obj.status == ENV.INSIGHT_STATUSES.REMODIFY) {
          let obj = {
            'type': this.type,
            'message': '<a href="/analyst/insights/compose/summary/' + this.insightsData.id + '">' + 'Your Published insight requested for revisiting / Amendments by ' + this.currentUser.first_name + ' ' + this.currentUser.last_name + '</a>',
            'from': this.currentUser.userid,
            'to': [this.insightsData.createdBy]
          }
          this._notificationApi.notification(obj).subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
              this._router.navigate(['/editorier/insights/un-publish'])
            }
          })
        }
      }
    });
  }

  ngAfterViewInit() {
    let that = this;
    setTimeout(function () {
      $(`#data h3`).each(function (index) {
        that.Headers[index] = $(this).text();
      });
      setTimeout(function () {
        $(`#data h3`).each(function (index) {
          $("p#header" + index).click(function () {
            $('html, body').animate({
              scrollTop: $("#data h3").eq(index).offset().top - ($('#fixed-top-header').height()+20)
            }, 100);
          });
        });
      }, 200);
    }, 3000);
  }

  private _loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private _loadData() {
    this.submit = true;
    this._dashbrdApi.fetchData(this.insightsData.ticker.name).subscribe(data => {
      if (data.dataset.data.length) {
        this.price = data.dataset.data[0][4];
        data.dataset.data.reverse();
        for (let c = 0; c < data.dataset.data.length; c++) {
          if (c) {
            this.ngxData.data[0].series.push({ name: (data.dataset.data[c - 1][0].split('-')[1] === data.dataset.data[c][0].split('-')[1]) ? ' '.repeat(c) :  this._datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
          else {
            this.ngxData.data[0].series.push({ name: this._datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
        }
        this.submit = false;
      }
      this._loadScript('./assets/js/scripts.js');
    }, (err) => {
      this.submit = false;
    });
  }

  public reply1() {
    this.reply = true;
    this.isPushed = true;
  }

  public closeAllForms() {
    let t = this._utils.objLen(this.showForm);
    if (t) {
      for (let k in this.showForm) {
        this.showForm[k] = false;
      }
    }
  }

  public replyToUpdate(obj = {}) {
    this.replyFor = obj['rid'] || this.replyFor;
    this.closeAllForms();
    this._getInsightscomments(false);
    this.isPushed = false;
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this._toastr.success(res.message, 'Success');
    }
    else {
      this._toastr.error(res.message, 'Invalid');
    }
  };

  private _handleSubmitError(err) {
    this._toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };

  public notification(data) {
    let obj = {
      'type': this.type,
      'message': 'anusha',
      'from': this.currentUser.userid,
      'to': [data.editorierId]
    }
    this._notificationApi.notification(obj).subscribe(data => {
      if (data.success) {
        this._toastr.success(data.message, 'Success');
      }
    })
  }

  public ReAssignToAnalyst() {
    let obj = {
      'id': this.id,
      'status': ENV.INSIGHT_STATUSES.REMODIFY,
    }
    this.PublishEvent(obj)
  }

  public Publish() {
    let obj = {
      'id': this.id,
      'status': ENV.INSIGHT_STATUSES.PUBLISHED,
    }
    this.PublishEvent(obj)
  }

  public Edit() {
    this._router.navigateByUrl(`/editorier/insights/summary/${this.id}`);
  }

  public switchForm(id) {
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
