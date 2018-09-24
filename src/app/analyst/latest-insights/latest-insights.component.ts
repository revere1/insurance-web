import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { InsightService } from '../../services/insights/insight.service';
import { ENV } from '../../env.config';

@Component({
  selector: 'app-latest-insights',
  templateUrl: './latest-insights.component.html',
  styleUrls: ['./latest-insights.component.css']
})
export class LatestInsightsComponent implements OnInit {

  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private routeSub: any;
  public serverURL = ENV.SERVER_URL;
  public id: any;
  public user: any;
  public insights = [];
  public switch: string = 'list-group-item';

  constructor(
    private _userapi: UserService,
    private _route: ActivatedRoute,
    private _insightService: InsightService,
    public utils: UtilsService
  ) { }

  ngOnInit() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
    });

    this._userapi.getUserById$(this.currentUserId).subscribe(data => {
      if (data.success === false) {
      } else {
        this.user = data.data;
      }
    });

    this._insightService.getInsights$(this.currentUserId).subscribe(data => {
      if (data.success === false) {
      } else {
        this.insights = data.data;
      }
    });
  }

}


