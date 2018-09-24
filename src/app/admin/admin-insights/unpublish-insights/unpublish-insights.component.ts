import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient} from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ComposeService } from '../../../services/compose.service';
import { CommodityService } from '../../../services/insights/commodity.service';
import { ENV } from './../../../env.config';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-unpublish-insights',
  templateUrl: './unpublish-insights.component.html',
  styleUrls: ['./unpublish-insights.component.css']
})
export class UnpublishInsightsComponent implements OnInit {

  public commodities: Array<Object>;
  userprofile: UserModel;
  public  createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public loading: boolean = true;
  public noRecords: boolean = true;
  objLen: number = 10;
  
  public dtOptions = {
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
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.ASSIGNED].concat([ENV.INSIGHT_STATUSES.SUBMITTED]) } },
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  public apiEvents = [];
  public insights = [];
  switch: string = 'grid-item';

  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    commodityId: [''],
    quickFilter: [''],
  });

  getCommodities() {
    this.cs.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }

  constructor(
    private http: HttpClient,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private router: Router,
    private cs: CommodityService,
    private _userapi: UserService,
    private meta: Meta,
    private fb: FormBuilder,
    public toastr: ToastsManager
   
  ) {
    this.getCommodities();
  }

  ngOnInit() {
    this.getInsights();
    this.onChanges();
  }

  //navigate to company profile
  public selectCompany(company) {
    this.router.navigateByUrl(`/company/` + company)
  }

  //navigate to user profile
  public selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id)
  }

  //navigate to ticker 
  public selectTicker(id) {
    this.router.navigateByUrl(`/ticker/` + id)
  }

  onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.columns[4].search['value'] = val.commodityId;
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

}
