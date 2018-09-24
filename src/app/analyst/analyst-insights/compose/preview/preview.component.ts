import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ComposeService } from '../../../../services/compose.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComposeModel } from '../../../../models/compose.model';
import { ToastsManager } from 'ng2-toastr';
import { UserService } from '../../../../services/user.service';
import { ENV } from '../../../../env.config';
import { NotificationService } from '../../../../services/notifications.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { DatePipe } from '@angular/common';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, AfterViewInit {
  public ngxData: any = {};
  public submit: boolean;
  @Input() insId: number;
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
  public autoScale = true;
  public price: any;
  public Headers = [];
  private dataRetrived: boolean = false;
  //<-------charts End ---------/>

  @Input() event: ComposeModel;
  private isEdit: boolean;
  private type: any;
  private routeSub: Subscription;
  private apiEvents = [];
  private finished: boolean = false;;
  private submitEventObj: ComposeModel;
  private submitEventSub: Subscription;
  private userid: number;
  private currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private whenPageLoad: boolean = true;
  private insightcommentId: number;
  private objLen: number = 10;
  private dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen
  };
  public showForm = {};
  public showComment = {};
  public insightscomments = [];
  public switch: string = '';
  public insightsData: any;
  public id: number;
  public loading: boolean;
  public isPushed: boolean = false;
  public replyFor = null;
  public submitBtnText: string;
  public AdminsList: any;
  public AdminsId = [];
  public error: boolean;
  public reply: boolean;
  public submitting: boolean;
  public insightsComments = [];
  public insightsCommentsChild = [];
  public serverURL = ENV.SERVER_URL;

  constructor(
    private _composeApi: ComposeService,
    private _route: ActivatedRoute,
    private _userapi: UserService,
    private _utils: UtilsService,
    private _notificationApi: NotificationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastr: ToastsManager,
    private _dashbrdApi: DashboardService,
    private _breadcrumbsService: BreadcrumbsService,
    private _datePipe: DatePipe
  ) { }

  public AssignForm: FormGroup = this._formBuilder.group({
    editorierId: [null, Validators.required],
  });

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] },
    { label: 'My Insights', url: 'insights/my-insights', params: [] },
    { label: 'Preview', url: 'preview', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this._breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.ngxData = {
      data: [
        {
          name: 'api',
          series: []
        }
      ]
    }
    this.reply = false;
    this.userid = this._userapi.getCurUserId();
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
        this.insightcommentId = params['insightId'];
      });
    this._userapi.getUserList(1).subscribe(data => {
      if (data.success === false) {
      } else {
        this.AdminsList = data.data
        this.AdminsList.forEach(val => {
          this.AdminsId.push(val.id)
        })
      }
    });
    let apiEvent = this._composeApi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
        this._router.navigate(['/analyst/insights/my-insights'])
      } else {
        this.finished = true;
        this.insightsData = data.data;
        if (this.insightsData.ticker != null) {
          this._loadData();
        }
        this.type = this.insightsData.type;
      }
    });
    this._composeApi.getInsightcommentById$(this.id, this.dtOptions).subscribe(data => {
      this.loading = true;
      this.finished = true;
      this.getInsightscomments();
      (this.apiEvents).push(apiEvent);
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
              scrollTop: $("#data h3").eq(index).offset().top - ($('#fixed-top-header').height() + 20)
            }, 100);
          });
        });
      }, 200);
      if ($('.analyst-graph').length) {
        let v = $('.analyst-graph').height();
        if (v > 500) {
          $('.analyst-graph').css('height', '500px');
          $('.analyst-graph:hover').css('overflow-y', 'scroll');
        }
      }
    }, 3000);
  }

  public onScrollUp() {
    this.dtOptions.start += this.objLen;
    this.finished = false;
    this.getInsightscomments();
    this.finished = true;
  }

  public getInsightscomments(append = true) {
    this._composeApi.getInsightcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.rows.length !== this.objLen) {
        if (!append) this.insightsComments = [];
        if (data.data.rows.length) {
          this.insightsCommentsChild = (data.data.count);
          data.data.rows = this._utils.list_to_tree(data.data.rows);
          this.insightsComments = (data.data.rows).concat(this.insightsComments);
        }
        this.finished = true;
      } else {
        if (data.data.rows.length) this.insightsComments = (data.data.rows).concat(this.insightsComments);
        if (this.whenPageLoad) {
          this.replyFor = ((this.insightsComments).length) ? this.insightsComments[this.insightsComments.length - 1].pcid : null;
          this.whenPageLoad = false;
        }
      }
    });
  }
  
  public update(status) {
    let obj = {
      'id': this.id,
      'status': (status == 'remodify') ? ENV.INSIGHT_STATUSES.ASSIGNED : ENV.INSIGHT_STATUSES.SUBMITTED
    }
    this._composeApi.publishEvent$(obj).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        this.insightsData.status = ENV.INSIGHT_STATUSES.SUBMITTED
        let orgCopyobj = {
          'type': 'insight',
          'type_id': this.insightsData.id,
          'data': JSON.stringify(this.insightsData)
        }
        this._notificationApi.orgCopy(orgCopyobj).subscribe(data => {
          if (data.success) {
          }
        });
      }
      if (data.success) {

        if (status !== 'remodify') {
          let notificationObj = {
            'type': this.type,
            'message': '<a href="admin/insights/compose/preview/' + this.insightsData.id + '">' + this.currentUser.first_name + ' ' + this.currentUser.last_name + '(Analyst) Posted an insight, Please assign this to editorial to verify & Publish ' + '</a>',
            'from': this.currentUserId,
            'to': this.AdminsId
          }
          this._notificationApi.notification(notificationObj).subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
              this._router.navigate(['/analyst/insights/my-insights'])
            }
          });
        } else {
          let notificationObj = {
            'type': this.type,
            'message': '<a href="editorier/insights/preview/' + this.insightsData.id + '">' + this.currentUser.first_name + ' ' + this.currentUser.last_name + '(Analyst) Remodify The  insight, Please Verify & Publish ' + '</a>',
            'from': this.currentUserId,
            'to': [this.insightsData.editorierId]
          }
          this._notificationApi.notification(notificationObj).subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
              this._router.navigate(['/analyst/insights/my-insights'])
            }
          });
        }
      }
      else {
        this._toastr.error(data.message, 'Invalid');
      }
    });
  }

  public loadScript(url) {
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
            this.ngxData.data[0].series.push({ name: (data.dataset.data[c - 1][0].split('-')[1] === data.dataset.data[c][0].split('-')[1]) ? ' '.repeat(c) : this._datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
          else {
            this.ngxData.data[0].series.push({ name: this._datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
        }
        this.submit = false;
      }
      this.loadScript('./assets/js/scripts.js');
    }, (err) => {
      this.submit = false;
    });
  }

  public selectUser(id) {
    this._router.navigateByUrl(`/profile/` + id)
  }

  public navigation1() {
    if (this.id !== undefined) {
      if ((this.insightsData.status != 'submitted') && (this.insightsData.status != 'assigned') && (this.insightsData.status != 'published')) {
        this._router.navigateByUrl(`/analyst/insights/compose/summary/${this.id}`);
      }
    }
  }

  public navigation() {
    if (this.id !== undefined) {
      if ((this.insightsData.status != 'submitted') && (this.insightsData.status != 'assigned') && (this.insightsData.status != 'published')) {
        this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${this.type}/${this.id}`);
      }
    }
  }

  public onNotify(msgRec) {
    this.insightsComments.push(msgRec);
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
    this.getInsightscomments(false);
    this.isPushed = false;
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this._toastr.success(res.message, 'Success');
    }
    else {
      this._toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this._toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }

  public switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      });
    }
  }

}



