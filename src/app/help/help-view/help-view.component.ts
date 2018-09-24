import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { HelpService } from '../../services/help.service';
import { UtilsService } from '../../services/utils.service';
import { Meta } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HelpModel } from '../../models/help.model';
import { ENV } from './../../env.config';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-help-view',
  templateUrl: './help-view.component.html',
  styleUrls: ['./help-view.component.css']
})
export class HelpViewComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  routeSub: Subscription;
  private id: number;
  userSub: Subscription;
  private msgTo: number;
  private problemId: number;
  private createdBy: number;
  userprofile: UserModel
  problem_files: HelpModel; 
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public files: string = null;
  public loading: boolean;
  public reply: boolean;
  public problemsData: any;
  public problemsData1 = [];
  public problemsData3 = []
  public replyFor = null;
  public userid: number;
  public isPushed: boolean = false;
  public disableScrollDown = false
  public whenPageLoad: boolean = true;
  public finished: boolean = false;
  public apiEvents = [];


  objLen: number = 10;
  public dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,

    "length": this.objLen,

  };


  // boolean when end of database is reached
  public error: boolean;
  public problemscomments = [];
  public switch: string = '';



  onScrollUp() {
    this.dtOptions.start += this.objLen;
    this.finished = false;
    this.getProblemscomments();
    this.finished = true;
  }

  private getProblemscomments(append = true) {
    this._helpService.getHelpcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.length !== this.objLen) {
        data.data.reverse();
        if (data.data.length && (!this.problemsData1.length)) {
          this.problemsData1 = (data.data).concat(this.problemsData1);
          this.replyFor = ((this.problemsData1).length) ? this.problemsData1[this.problemsData1.length - 1].pcid : null;
        }
        this.finished = true;
      } else {
        data.data.reverse();
        if (data.data.length) this.problemsData1 = (data.data).concat(this.problemsData1);
      }
      if (this.whenPageLoad) {
        this.replyFor = ((this.problemsData1).length) ? this.problemsData1[this.problemsData1.length - 1].pcid : null;
        this.whenPageLoad = false;
      }
    });
  }
  constructor(

    private _helpService: HelpService,
    private _utils: UtilsService,
    private _userapi: UserService,
    private meta: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbsService,
    public toastr: ToastsManager,
    private _auth: AuthService,
  ) {
    this.reply = false;
    this.userid = this._userapi.getCurUserId();
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this.problemId = params['id']
      });
      _auth.loadSession();

  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnInit() {

    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] },
    { label: 'Help', url: 'help', params: [] }, { label: 'Read', url: 'read', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/

    this.reply = false;
    this.userid = this._userapi.getCurUserId();
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this.problemId = params['problemId'];
      });



    //Fetch Messages based on Id
    let apiEvent = this._helpService.getHelpById$(this.id).subscribe(data => {
      if (!data.data.length) {
        this.router.navigateByUrl('/help');
      } else {
        this.problemsData = data.data;
      }
    });

    this._helpService.updateAllUnread(this.id, this._helpService.getUserId()).subscribe(data => { });
    this.loading = true;
    this.finished = true;
    this.getProblemscomments();
    (this.apiEvents).push(apiEvent);
  }

  onNotify(msgRec) {
    this.problemsData1.push(msgRec);
  }

  reply1() {
    this.reply = true;
    this.isPushed = true;
  }

  replyToUpdate(obj) {
    this.replyFor = obj.rid;
    this.problemsData1.push(obj.newComment);
    this.reply = this.isPushed = false;
  }

  public ngonDestory() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}