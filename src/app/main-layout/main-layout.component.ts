import { Component, OnInit, ViewEncapsulation,ElementRef, ViewContainerRef,AfterViewInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { ENV } from '../env.config';
import { ScriptService } from '../services/script.service';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notifications.service';
import { MessagesService } from '../services/messages.service';
import { HelpService } from '../services/help.service';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit,AfterViewInit{
  public messagesCount: number;
  public user: boolean = false;
  public problemsCount: number;
  public lockersCount: number;
  public messagesData: string
  public problemsData: string
  public notificationCount: number;
  public notificationData: string;
  public role: any;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = 'assets/img/avatar.png';
  public viewContainerRef: ViewContainerRef;
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public bcList: IBreadcrumb[];

  constructor(
    public script: ScriptService, 
    public auth: AuthService,
    public toastr: ToastsManager,
    public _utils: UtilsService,
    private router: Router,
    private _userapi: UserService,
    private _notificationapi: NotificationService,
    private _messagesService: MessagesService,
    private _helpService: HelpService,
    private breadcrumbsService:BreadcrumbsService,
    private elementRef: ElementRef,
    viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
    this.toastr.setRootViewContainerRef(viewContainerRef);
     this.loadAssets();
  }

  loadAssets() {
    this.script.load('adminlte').then(data => {
    }).catch(error => console.log(error));
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
 }
  ngOnInit() {
    this.bcList = [
      { label: 'Insights', url: 'insights', params: [] }
    ];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
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
    if (this.currentUser) {
      this.user = true;
      var  access_level = this.currentUser.user.access_level;
      //Fetch Messages
      this._messagesService.messagesCount$(this.currentUser.user.userid).subscribe(data => {
        if (data.success === false) {
        } else {
          this.messagesCount = data.count;
          this.messagesData = data.data
        }
      });
      //Fetch Problems
      this._helpService.problemsCount$(this.currentUser.user.userid).subscribe(data => {
        if (data.success === false) {
        } else {
          this.problemsCount = data.count;
          this.problemsData = data.data
        }
      });
      //Fetch Problems
      this._notificationapi.notificationsCount$(this.currentUser.user.userid).subscribe(data => {
        if (data.success === false) {
        } else {
          this.notificationCount = data.count;
          this.notificationData = data.data;
        }
      });
      this.getAvatar();
    }
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
      if (this.currentUser.user.access_level === 1) this.router.navigate(['/messages/read', id]);
      if (this.currentUser.user.access_level === 2) this.router.navigate(['/messages/read', id]);
      if (this.currentUser.user.access_level === 3) this.router.navigate(['/messages/read', id]);
      if (this.currentUser.user.access_level === 4) this.router.navigate(['/messages/read', id]);
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
    if (this.currentUser.user.access_level === 1) this.router.navigate(['/help/read', id]);
    if (this.currentUser.user.access_level === 2) this.router.navigate(['/help/read', id]);
    if (this.currentUser.user.access_level === 3) this.router.navigate(['/help/read', id]);
    if (this.currentUser.user.access_level === 4) this.router.navigate(['/help/read', id]);
  }

  private getAvatar() {
    this.avatar = this.auth.currentUser.profile_pic ? ENV.SERVER_URL + this.auth.currentUser.profile_pic : this.avatar;
  }
}
