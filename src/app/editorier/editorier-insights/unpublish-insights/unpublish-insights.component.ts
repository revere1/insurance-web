import { Component, OnInit } from '@angular/core';
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
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-unpublish-insights',
  templateUrl: './unpublish-insights.component.html',
  styleUrls: ['./unpublish-insights.component.css']
})
export class UnpublishInsightsComponent implements OnInit {

  private userprofile: UserModel;
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
    "userId": this.currentUserId,
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.ASSIGNED].concat([ENV.INSIGHT_STATUSES.REMODIFY], [ENV.INSIGHT_STATUSES.PUBLISHED]) } },
  };
  private finished = false  // boolean when end of database is reached
  public error: boolean;
  private apiEvents = [];
  public insights = [];
  public switch: string = 'grid-item';
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public loading: boolean = true;
  public noRecords: boolean = true;
  public commodities: Array<Object>;

  constructor(
    private _route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router,
    private _composeApi: ComposeService,
    private _utils: UtilsService,
    private _commodityApi: CommodityService,
    private _userApi: UserService,
    private _meta: Meta,
    private _toastr: ToastsManager,
    private _formBuilder: FormBuilder
  ) {
    this._getCommodities();
  }

  ngOnInit() {
    this._route.queryParams
      .subscribe(params => {
        let status = params['status'];
        if (status === 'ongoing-reviews') {
          this.probFilterForm.controls['status'].patchValue('ongoing-reviews');
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY] };
        }
        else if (status === 'published') {
          this.probFilterForm.controls['status'].patchValue('published');
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] };
        } else {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY, ENV.INSIGHT_STATUSES.ASSIGNED, ENV.INSIGHT_STATUSES.PUBLISHED] }
        }
      });
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dtOptions.columns[3].search['value'] = currentUser.user.userid;
    this._getInsights();
    this._onChanges();
  }

  public probFilterForm: FormGroup = this._formBuilder.group({
    sortBy: ['recent'],
    status: [''],
    quickFilter: [''],
  });

  private _getCommodities() {
    this._commodityApi.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }
  
  public selectCompany(company) {
    this._router.navigateByUrl(`/company/` + company)
  }

  public selectUser(id) {
    this._router.navigateByUrl(`/profile/` + id)
  }

  public selectTicker(id) {
    this._router.navigateByUrl(`/ticker/` + id)
  }

  private _onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val.status === 'ongoing-reviews') {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY] }
        }
        else if (val.status === 'published') {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] }
        } else {
          this.dtOptions.where.status = { $in: [ENV.INSIGHT_STATUSES.REMODIFY, ENV.INSIGHT_STATUSES.ASSIGNED, ENV.INSIGHT_STATUSES.PUBLISHED] }
        }
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.insights = [];
        this._getInsights();
      });
  }

  public onScroll() {
    this.dtOptions.start += this.objLen;
    this._getInsights();
  }

  private _getInsights(append = true) {
    if (this.finished) return;
    this._composeApi
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
}


