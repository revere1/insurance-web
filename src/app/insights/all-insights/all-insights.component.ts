import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CommodityService } from '../../services/insights/commodity.service';
import { ENV } from './../../env.config';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComposeService } from '../../services/compose.service';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UserModel } from '../../models/user.model';
@Component({
  selector: 'app-all-insights',
  templateUrl: './all-insights.component.html',
  styleUrls: ['./all-insights.component.css'],

})
export class AllInsightsComponent implements OnInit {
  public commodities: Array<Object>;
  public userprofile: UserModel;
  private createdBy: number;
  public userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public loading: boolean = true;
  public user: boolean = false;
  public noRecords: boolean = true;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public baseURI = ENV.BASE_URI
  public objLen: number = 10;

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
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };

  finished = false  // boolean when end of database is reached
  public error: boolean;
  public apiEvents = [];
  public insights = [];
  public switch: string = 'grid-item';

  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    commodityId: [''],
    quickFilter: [''],
  });

  constructor(
    private http: HttpClient,
    private _userapi: UserService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private breadcrumbsService: BreadcrumbsService
  ) {
    auth.loadSession();
    this.getCommodities();
  }
  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Insights', url: 'insights', params: [] }
    ];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.getInsights();
    this.onChanges();
    if (this.currentUser) {
      this.user = true;
    };
  }

  getCommodities() {
    this.cs.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }

  addFollowers(userId: number) {
    if (this.currentUser) {
      let followerObj = {
        'analyst_id': userId,
        'followedBy': this.currentUser.user.userid
      }
      this._userapi.analystFollowers$(followerObj).subscribe(data => {
        if (data.success) {
          this.toastr.success(data.message, 'Success');
        }
        else {
          this.toastr.error(data.message, 'Invalid');
        }
      })
    } else {
      this.router.navigate(['/auth/login'])
    }
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
  //navigate to company profile
  public selectCompany(company) {
    this.router.navigateByUrl(`/company/` + company);
  }

  // navigate to userprofile
  public selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id);
  }
  //navigate to based on ticker
  public selectTicker(id) {
    this.router.navigateByUrl(`/ticker/` + id);
  }

  // navigate to based on currency
  public selectCurrency(id) {
    this.router.navigateByUrl(`/currency/` + id);
  }

  // navigate to based on region
  selectRegion(id) {
    this.router.navigateByUrl(`/region/` + id);
  }

  // navigate to based on sector
  selectSector(id) {
    this.router.navigateByUrl(`/sector/` + id);
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
        this.loading = false;
      })
  }

  addwatchlist(id: number, type) {
    let insViewObj = {
      'type': type,
      'type_id': id
    }
    this._composeService.insightAddwatchlist$(insViewObj)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success(data.message, 'Success');
          }
          else {
            this.toastr.error(data.message, 'Invalid');
          }
        });
  }

}
