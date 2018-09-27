import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { ENV } from './../../env.config';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { NotificationService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-surveyor-layout',
  templateUrl: './surveyor-layout.component.html',
  styleUrls: ['./surveyor-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyorLayoutComponent implements OnInit {

  private bcList: IBreadcrumb[];
  private viewContainerRef: ViewContainerRef;
  public problemsCount: number;
  public messagesCount: number;
  public messagesData: string;
  public problemsData: string;
  public notificationCount: number;
  public notificationData: string;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = 'assets/img/avatar.png';

  constructor(
    private _auth: AuthService,
    private _toastr: ToastsManager,
    private _router: Router,
    private _messagesApi: MessagesService,
    private _helpApi: HelpService,
    private _notificationApi: NotificationService,
    private _elementRef: ElementRef,
    public auth: AuthService,
    private _breadcrumbsService: BreadcrumbsService,
    private _utils: UtilsService,
    private _viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = _viewContainerRef;
    this._toastr.setRootViewContainerRef(_viewContainerRef);
  }

  ngOnInit() {
    this.bcList = [{ label: 'Home', url: 'home', params: [] }];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this._breadcrumbsService.store(list);
    });
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    //Fetch Messages
    this._messagesApi.messagesCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.messagesCount = data.count
        this.messagesData = data.data
      }
    });
    //Fetch Notifications
    this._notificationApi.notificationsCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.notificationCount = data.count;
        this.notificationData = data.data;
      }
    });
    //Fetch Problems
    this._helpApi.problemsCount$(currentUser.user.userid, ).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsCount = data.count;
        this.problemsData = data.data
      }
    });
    this._getAvatar();
  }

  ngAfterViewInit() {
    this._elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
  }

  public removelistitem(id) {
    this._messagesApi.updateIsRead$(id).subscribe(data => {
      $('#relistitem' + id).remove();
      $("#rcount,#rcounthead").text(function (v, n) {
        if (JSON.parse(n) != 0) {
          return JSON.parse(n) - 1;
        } else {
          return 0;
        }
      });
      this._router.navigate(['/messages/read', id])
    });
  }

  public removehelpitem(id) {
    $('#helpitem' + id).remove();
    $("#rehelpcounthead,#rehelpcount").text(function (v, n) {
      if (JSON.parse(n) != 0) {
        return JSON.parse(n) - 1;
      } else {
        return 0;
      }
    });
    this._router.navigate(['/help/read', id])
  }

  public _getAvatar() {
    this.avatar = this.auth.currentUser.profile_pic ? ENV.SERVER_URL + this.auth.currentUser.profile_pic : this.avatar;
  }
  

}

