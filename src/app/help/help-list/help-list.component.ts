import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router } from '@angular/router';
import { ENV } from '../../env.config';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.css'],
})
export class HelpListComponent implements OnInit {

  public serverURL = ENV.SERVER_URL;
  currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  public role: any;
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  objLen: number = 10;
  public loading: boolean = true;
  public noRecords: boolean = true;
  private dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "subject", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "status", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "description", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": this.currentUserId,
    "search": { "value": "", "regex": false }
  };
  finished = false  // boolean when end of database is reached
  error: boolean;
  apiEvents = [];
  problems = [];
  switch: string = 'grid-item';

  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    status: [''],
    quickFilter: [''],
  });


  constructor(
    private http: HttpClient,
    private router: Router,
    private _helpService: HelpService,
    private _utils: UtilsService,
    private meta: Meta,
    private fb: FormBuilder,
    private breadcrumbsService: BreadcrumbsService,
    public toastr: ToastsManager,
    private _auth: AuthService,
    private _userapi: UserService,

  ) { 
  _auth.loadSession();
  }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] },
    { label: 'Help', url: 'help', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/

    if (!this.currentUser) {
    }
    else {
      this._userapi.getRoleByAccess$(this.currentUser.user.access_level).subscribe(data => {
        if (data.success === false) {
        } else {
          this.role = data.data.name;
        }
      });
    }

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.user.userid === 1) {
    }
    else {
      this.dtOptions.columns[3].search['value'] = currentUser.user.userid;
    }

    this.getProblems();
    this.onChanges();
  }

  onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.columns[1].search['value'] = val.status;
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.problems = [];
        this.getProblems();
      });
  }

  public onScroll() {
    this.dtOptions.start += this.objLen;
    this.getProblems();
  }
  selectCompany(company) {
    this.router.navigateByUrl(`/company/` + company)
  }
  selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id)
  }
  private getProblems(append = true) {
    if (this.finished) return;

    this._helpService
      .filterProblems$(this.dtOptions, 'filter-problems')
      .subscribe(data => {
        this.loading = false;
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.problems = (this.problems).concat(data.data);
      })
  }

}