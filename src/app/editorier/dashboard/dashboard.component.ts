import { Component, OnInit } from '@angular/core';
import { InsightService } from '../../services/insights/insight.service';
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

  constructor(private _insightApi: InsightService) { }

  ngOnInit() {
    this._insightApi.getEditorierInsightsCount(this.currentUserId, this.status).subscribe(data => {
      if (data.success == false) {
      } else {
        this.insightsDataByStatus = data.data
        this.insightsDataByStatus.forEach(val => {
          if (val.status == ENV.INSIGHT_STATUSES.PUBLISHED) {
            this.published.push(val)
          }
          if (val.status == ENV.INSIGHT_STATUSES.REMODIFY) {
            this.remodify.push(val)
          }
        });
      }
    });
  }

}
