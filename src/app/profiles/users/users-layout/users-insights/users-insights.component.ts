import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HelpService } from '../../../../services/help.service';
import { UserService } from '../../../../services/user.service';
import { UtilsService } from '../../../../services/utils.service';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { ENV } from '../../../../env.config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CommodityService } from '../../../../services/insights/commodity.service';
import { ComposeService } from '../../../../services/compose.service';
import { AuthService } from '../../../../services/auth.service';
import { UserModel } from '../../../../models/user.model';
@Component({
  selector: 'app-users-insights',
  templateUrl: './users-insights.component.html',
  styleUrls: ['./users-insights.component.css']
})
export class UsersInsightsComponent implements OnInit {
  public commodities: Array<Object>;
  userprofile: UserModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public noRecords: boolean = true;
  objLen: number = 10;
  public id:any;
  public role:any;
  public show : any = null;
  public hoverIndex : any = null;
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public baseURI = ENV.BASE_URI;
  private routeSub = this.route.parent.params
  .subscribe(params => {
    this.id = params['id'];
  });
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
    "currentUserId": {createdBy:{$in:[this.id]}},
    "search": { "value": "", "regex": false },
    "where": { status: { $in:[ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  insights = [];
  switch: string = 'list-group-item';



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
    private route:ActivatedRoute,
    private _userapi:UserService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private auth : AuthService
  ) {
    auth.loadSession();
    this.getCommodities();
  }

  ngOnInit() {
    this.getInsights();
    this.onChanges();
    this.dtOptions.columns[3].search['value'] = this.id;
    if(this.currentUser){
      this._userapi.getRoleByAccess$(this.currentUser.user.access_level).subscribe(data => {
        if(data.success === false){
        }else{
          this.role = data.data.name;
        }
      })
    }
    var isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
  };
  if( isMobile.any() ){ this.switch = 'grid-item' };
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

enter(i) {
    this.hoverIndex = i;
}
leave(i) {
  this.show = null;
  this.hoverIndex = null;
}
share(i) {
this.show = i;
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
