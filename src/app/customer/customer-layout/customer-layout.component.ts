import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef, AfterViewInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { ScriptService } from '../../services/script.service';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { UserService } from '../../services/user.service';
import { ENV } from '../../env.config';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { NotificationService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerLayoutComponent implements OnInit, AfterViewInit {

  public viewContainerRef: ViewContainerRef;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = 'assets/img/avatar.png';
  public bcList: IBreadcrumb[];
  public problemsCount: number;
  public messagesCount: number;
  public notificationCount: number;
  public messagesData: string;
  public problemsData: string;
  public notificationData: string;

  constructor(

    private router: Router,
    private _messagesService: MessagesService,
    private _helpService: HelpService,
    private _notificationapi: NotificationService,
    private _userapi: UserService,
    private elementRef: ElementRef,
    private breadcrumbsService: BreadcrumbsService,
    public _utils: UtilsService,
    public script: ScriptService,
    public auth: AuthService,
    public toastr: ToastsManager,
    viewContainerRef: ViewContainerRef,
  ) {
    this.viewContainerRef = viewContainerRef;
    this.toastr.setRootViewContainerRef(viewContainerRef);
  }


  loadAssets() {
    this.script.load('adminlte').then(data => {
    }).catch(error => console.log(error));
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
  }
  ngOnInit() {

    this.bcList = [{ label: 'Home', url: 'home', params: [] }];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);

    //Fetch Messages
    this._messagesService.messagesCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.messagesCount = data.count
        this.messagesData = data.data
      }
    });

    //Fetch Problems
    this._helpService.problemsCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsCount = data.count;
        this.problemsData = data.data
      }
    });

    //Fetch Notifications
    this._notificationapi.notificationsCount$(currentUser.user.userid).subscribe(data => {
      if (data.success === false) {
      } else {
        this.notificationCount = data.count;
        this.notificationData = data.data;
      }
    });

    this.getAvatar();
  }
  removelistitem(id) {
    this._messagesService.updateIsRead$(id).subscribe(data => {
      $('#relistitem' + id).remove();
      $("#rcount,#rcounthead").text(function (v, n) {
        if (JSON.parse(n) != 0) {
          return JSON.parse(n) - 1;
        } else {
          return 0;
        }
      });
      this.router.navigate(['/messages/read', id])
    });
  }

  removehelpitem(id) {
    $('#helpitem' + id).remove();
    $("#rehelpcounthead,#rehelpcount").text(function (v, n) {
      if (JSON.parse(n) != 0) {
        return JSON.parse(n) - 1;
      } else {
        return 0;
      }
    });
    this.router.navigate(['/help/read', id])
  }
  getAvatar() {
    this.avatar = this.auth.currentUser.profile_pic ? ENV.SERVER_URL + this.auth.currentUser.profile_pic : this.avatar;
  }

}
