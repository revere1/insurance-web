import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../../env.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class InsightService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      return this.currentUser.token;
    }
    return 'revere';
  }


  public getToken() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Creating new Insight
  public createInsight(event) {
    return this.http
      .post(`${ENV.BASE_API}create-insight`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  public getCurUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  //Getting insight based on Id
  public getInsightById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}insights/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting All publish insights of perticular user
  public getInsights$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}ins/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Latest company insights
  public getLatestComapanyInsights$(companyId: any) {
    return this.http
      .get(`${ENV.BASE_API}latest-insight/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Company All insights
  public getComapanyInsights$(companyId: any) {
    return this.http
      .get(`${ENV.BASE_API}insight/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Watchlist of perticular user 
  public getWatchedList$(userId) {
    return this.http
      .post(`${ENV.BASE_API}watch-list`, { 'currentUserId': userId }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Privillages Users List
  public getPrivillagesUsers$(userId) {
    return this.http
      .post(`${ENV.BASE_API}privillages`, { 'currentUserId': userId }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting reasearch insight users
  public getResearchInsightUsers$() {
    return this.http
      .get(`${ENV.BASE_API}research-insights`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Put event for update Insight
  public editEvent$(id: number, event) {
    return this.http
      .put(`${ENV.BASE_API}updateinsight/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting  Global search of Insights
  public elasticInsights(term) {
    return this.http
      .get(`${ENV.BASE_API}elastic/insights?term=` + term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting  Global search of tickers
  public elasticTickers(term) {
    return this.http
      .get(`${ENV.BASE_API}elastic/tickers?term=` + term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Insights count
  public getInsightsCount(userId, status) {
    return this.http
      .post(`${ENV.BASE_API}status-count`, { 'currentUserId': userId, 'statuses': status }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError)
  }

  //Getting Editorier insights count
  public getEditorierInsightsCount(userId, status) {
    return this.http
      .post(`${ENV.BASE_API}editorier-status-count`, { 'currentUserId': userId, 'statuses': status }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError)
  }

  //Getting Trending insights 
  public getTrendingInsights$() {
    return this.http
      .get(`${ENV.BASE_API}trending-insights`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting New insights 
  public getNewInsights$() {
    return this.http
      .get(`${ENV.BASE_API}new-insights`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting  insights for vector distribution chart
  public getInsightsForVertical$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}userVertical/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Company insights for vertical distribution chart
  public getCompInsightsForVertical$(companyId: string) {
    return this.http
      .get(`${ENV.BASE_API}companyVertical/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting insights for sector distribution chart
  public getInsightsForSectorDist$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}userSectorDist/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting Company insights for sector distribution chart
  public getCompInsightsForSectorDist$(companyId: any) {
    return this.http
      .get(`${ENV.BASE_API}companySectorDist/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting  user  count
  public userInsightsCount$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}userInsCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting  company followers count
  public companyInsightsCount$(companyId: number) {
    return this.http
      .get(`${ENV.BASE_API}companyInsCount/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting user followers count
  public userFollowersCount$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}userFollowCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Getting company followers count
  public companyFollowersCount$(user: number) {
    return this.http
      .get(`${ENV.BASE_API}compFollowCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Error Handlling Function
  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.router.navigate(['/auth/login']);
    }
    return Observable.throw(errorMsg);
  }
}
