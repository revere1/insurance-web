import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { MatchHeightDirective } from '../../../shared/directives/match-height.directive';


@Component({
  selector: 'app-un-publlish-inisghts',
  templateUrl: './un-publlish-inisghts.component.html',
  styleUrls: ['./un-publlish-inisghts.component.css']
})
export class UnPubllishInisghtsComponent implements OnInit {

  @ViewChild(MatchHeightDirective) directive = null;
  private userSub: Subscription;
  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private objLen: number = 10;
  private dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "headline", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "summary", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "description", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "commodityId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "tickerId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": { createdBy: { $in: [this.currentUserId] } },
    "search": { "value": "", "regex": false },
    "where": { status: { $in: ENV.INSIGHT_STATUSES.DRAFTS.concat([ENV.INSIGHT_STATUSES.REMODIFY], [ENV.INSIGHT_STATUSES.ASSIGNED], [ENV.INSIGHT_STATUSES.PUBLISHED], [ENV.INSIGHT_STATUSES.SUBMITTED]) } }
  };
  private finished = false  // boolean when end of database is reached
  private apiEvents = [];
  public insights = [];
  public switch: string = 'grid-item';
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public loading: boolean = true;
  public noRecords: boolean = true;
  public commodities: Array<Object>;
  public error: boolean;
  public drafts = ENV.INSIGHT_STATUSES.DRAFTS;
  public ongoing = [ENV.INSIGHT_STATUSES.SUBMITTED, ENV.INSIGHT_STATUSES.ASSIGNED];

  constructor(
    private _http: HttpClient,
    private _composeService: ComposeService,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _router: Router,
    private _cs: CommodityService,
    private _userapi: UserService,
    private _meta: Meta,
    private _toastr: ToastsManager,
    private _fb: FormBuilder,
    private _breadcrumbsService: BreadcrumbsService
  ) {
    this._getCommodities();
  }

  public probFilterForm: FormGroup = this._fb.group({
    sortBy: ['recent'],
    status: [''],
    quickFilter: [''],
  });

  private _getCommodities() {
    this._cs.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'My Insights', url: 'my-insights', params: [] }
    ];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this._breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this._route.queryParams
      .subscribe(params => {
        let status = params['status'];
        if (status === 'drafts') {
          this.probFilterForm.controls['status'].patchValue('drafts');
          this.dtOptions.where.status = { $in: this.drafts };
        }
        else if (status === 'ongoing-reviews') {
          this.probFilterForm.controls['status'].patchValue('ongoing-reviews');
          this.dtOptions.where.status = { $in: this.ongoing };
        }
        else if (status === 'published') {
          this.probFilterForm.controls['status'].patchValue('published');
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] };
        }
        else if (status === 'revisiting') {
          this.probFilterForm.controls['status'].patchValue('revisiting');
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY] };
        } else {
          this.dtOptions.where.status = { $in: ENV.INSIGHT_STATUSES.DRAFTS.concat([ENV.INSIGHT_STATUSES.REMODIFY], [ENV.INSIGHT_STATUSES.ASSIGNED], [ENV.INSIGHT_STATUSES.PUBLISHED], [ENV.INSIGHT_STATUSES.SUBMITTED]) }
        }
      });
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dtOptions.columns[3].search['value'] = currentUser.user.userid;
    this.getInsights();
    this._onChanges();
  }
// navigate to company profile
  public selectCompany(company) {
    this._router.navigateByUrl(`/company/` + company)
  }

  //navigate to  user profile
  public selectUser(id) {
    this._router.navigateByUrl(`/profile/` + id)
  }

  //navigate to ticker
  public selectTicker(id) {
    this._router.navigateByUrl(`/ticker/` + id)
  }

  public deleteInsight(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._composeService.deleteInsightById$(id)
        .subscribe(
          data => this._handleSubmitSuccess(data, id),
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }

  private _onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val.status === 'drafts') {
          this.dtOptions.where.status = { $in: this.drafts }
        }
        else if (val.status === 'ongoing-reviews') {
          this.dtOptions.where.status = { $in: this.ongoing }
        }
        else if (val.status === 'published') {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] }
        }
        else if (val.status === 'revisiting') {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY] }
        } else {
          this.dtOptions.where.status = { $in: ENV.INSIGHT_STATUSES.DRAFTS.concat([ENV.INSIGHT_STATUSES.REMODIFY], [ENV.INSIGHT_STATUSES.ASSIGNED], [ENV.INSIGHT_STATUSES.PUBLISHED], [ENV.INSIGHT_STATUSES.SUBMITTED]) }
        }
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.insights = [];
        this.getInsights();
      });
  }

  public onScroll() {
    this.dtOptions.start += this.objLen;
    this.getInsights();
  }

  private getInsights(append = true) {
    if (this.finished) return;
    this._composeService
      .filterInsights$(this.dtOptions, 'filter-insights')
      .subscribe(data => {
        this.loading = false;
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.insights = (this.insights).concat(data.data);
      })
  }

  private _handleSubmitSuccess(res, id = 0) {
    this.error = false;
    // Redirect to event detail
    if (res.success) {
      this._toastr.success(res.message, 'Success');
      let pos = this.insights.map(function (e) { return e.id; }).indexOf(id);
      this.insights.splice(pos, 1);
    }
    else {
      this._toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this._toastr.error(err.message, 'Error');
    this.error = true;
  }

}

