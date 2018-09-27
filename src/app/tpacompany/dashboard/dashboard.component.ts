import { Component, OnInit } from '@angular/core';
import { ENV } from '../../env.config';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private routeSub: any;
  public insightsDataByStatus: any;
  public id: any;
  public user: any;
  public insights = [];
  public drafts = [];
  public published = [];
  public assigned = [];
  public remodify = [];
  public switch: string = 'list-group-item';
  public status = [ENV.INSIGHT_STATUSES.PUBLISHED, ENV.INSIGHT_STATUSES.ASSIGNED, ENV.INSIGHT_STATUSES.REMODIFY, ENV.INSIGHT_STATUSES.DRAFTS, ENV.INSIGHT_STATUSES.SUBMITTED]

  constructor(
    private _userapi: UserService,
    private _utils: UtilsService,
  ) { }

  ngOnInit() {

  }

}
