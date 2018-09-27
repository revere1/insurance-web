import { Component, OnInit } from '@angular/core';
import { ENV } from '../../env.config';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  public insightsDataByStatus:any;
  public drafts = [];
  public published = [];
  public assigned = [];
  public remodify = [];
  public status = [ENV.INSIGHT_STATUSES.PUBLISHED, ENV.INSIGHT_STATUSES.ASSIGNED, ENV.INSIGHT_STATUSES.REMODIFY]

  constructor(
   
    ) { }

  ngOnInit() {

  }

}
