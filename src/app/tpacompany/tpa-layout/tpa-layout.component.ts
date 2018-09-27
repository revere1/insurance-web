import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef, ElementRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { ScriptService } from '../../services/script.service';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { UserService } from '../../services/user.service';
import { ENV } from './../../env.config';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { NotificationService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-tpa-layout',
  templateUrl: './tpa-layout.component.html',
  styleUrls: ['./tpa-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TpaLayoutComponent implements OnInit, AfterViewInit {

  private viewContainerRef: ViewContainerRef;
  public messagesCount: number;
  public messagesData: string;
  public avatar: string = 'assets/img/avatar.png';
  public serverURL = ENV.SERVER_URL;
  public problemsCount: number;
  public problemsData: string;
  public notificationCount: number;
  public notificationData: string;
  private bcList: IBreadcrumb[];

  constructor(private _script: ScriptService,
    private _toastr: ToastsManager,
    private _router: Router,
    private _messagesApi: MessagesService,
    private _helpApi: HelpService,
    public script: ScriptService,
    private _notificationApi: NotificationService,
    private _userApi: UserService,
    private _breadcrumbsService: BreadcrumbsService,
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    public utils: UtilsService,
    public auth: AuthService) {      
    this.viewContainerRef = _viewContainerRef;
    this._toastr.setRootViewContainerRef(_viewContainerRef);
  }

  loadAssets() {
    this.script.load('adminlte').then(data => {
    }).catch(error => console.log(error));
  }
  
  ngOnInit() {
    this.bcList = [{ label: 'Home', url: 'home', params: [] }];
    this.utils.changeBreadCrumb(this.bcList);
    this.utils.currentBSource.subscribe(list => {
      this._breadcrumbsService.store(list);
    });
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);

    //Fetch Countries
    this._messagesApi.messagesCount$(currentUser.user.userid, ).subscribe(data => {
      if (data.success === false) {
      } else {
        this.messagesCount = data.count;
        this.messagesData = data.data;
      }
    });

    //Fetch Problems
    this._helpApi.problemsCount$(currentUser.user.userid, ).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsCount = data.count;
        this.problemsData = data.data
        console.log(this.problemsData);
      }
    });
    this.getAvatar();

    //Fetch Notifications 
    this._notificationApi.notificationsCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.notificationCount = data.count;
        this.notificationData = data.data;
      }
    });
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
  
  private getAvatar() {
    this.avatar = this.auth.currentUser.profile_pic ? ENV.SERVER_URL + this.auth.currentUser.profile_pic : this.avatar;
  }

}

