import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { NotificationService } from '../../services/notifications.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  private objLen: number = 15;
  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "message", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": this.currentUserId,
    "search": { "value": "", "regex": false }
  };
  private finished = false  // boolean when end of database is reached
  public noRecords: boolean;
  public notifications = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationapi: NotificationService,
    private _breadcrumbsService: BreadcrumbsService,
    private _utils: UtilsService,
    private _auth: AuthService) {
    _auth.loadSession();
  }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] },
    { label: 'Notifications', url: 'notifications', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this._breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    $('#reduceNotifCount').text(function (v, n) {
      return 0;
    })
    this._getNotifications();
    this._onChanges();
  }

  public notificationFilterForm: FormGroup = this._formBuilder.group({
    sortBy: ['recent'],
    quickFilter: [''],
  });

  private _onChanges() {
    this.notificationFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.notifications = [];
        this._getNotifications();
      });
  }

  public onScroll() {
    this.dtOptions.start += this.objLen;
    this._getNotifications();
  }

  private _getNotifications(append = true) {
    if (this.finished) return;
    this._notificationapi
      .filterNotifications$(this.dtOptions, 'filter-notifications')
      .subscribe(data => {
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.notifications = (this.notifications).concat(data.data);
      })
  }


}
