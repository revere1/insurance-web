import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ComposeModel } from './../models/compose.model';
import { InsightCommentModel } from '../models/insightcomment.model';

@Injectable()
export class ComposeService {

  private currentUser: any = JSON.parse(localStorage.getItem('currentUser'));

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      return this.currentUser.token;
    }
    return 'revere';
  }

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Get insight based on id
  public getComposeById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}insights/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //delete insights
  public deleteInsightById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}insight/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //delete insights-attachments
  public deleteInsAttachmentById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}insight-attachment/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for fitering Insights
  public filterInsights$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //put event for Updating insight
  public editEvent$(id: number, event): Observable<ComposeModel> {
    return this.http
      .put(`${ENV.BASE_API}updateinsight/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //delete event for deleting files
  public removeFile(file) {
    return this.http
      .delete(`${ENV.BASE_API}problems/remove-file`, {
        headers: new HttpHeaders()
          .set('Authorization', this._authHeader)
          .set('file', file)
      })
      .catch(this._handleError);
  }

  //post event for uploading insight files
  public uploads(formData) {
    return this.http
      .post(`${ENV.BASE_API}insights/files`, formData, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //put event for publish insight
  public publishEvent$(obj) {
    return this.http
      .put(`${ENV.BASE_API}publish-insight`, obj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  };

  //Post event for creating insight comments
  public postEvents$(id: number, event: InsightCommentModel) {
    return this.http
      .post(`${ENV.BASE_API}insight_comments/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting insight comment reply
  public getInsightcommentById$(id: number, filterInput = {}) {
    return this.http
      .post(`${ENV.BASE_API}insights_commentsreply/${id}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for getting insight comment based on Id
  public getInsightcommentsById$(id: number, filterInput) {
    return this.http
      .post(`${ENV.BASE_API}insights_commentsreply/${id}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting Insight based on Id
  public getInsightById$(from: number) {
    return this.http
      .get(`${ENV.BASE_API}insight/${from}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for creating insight views
  public insightView$(viewObj) {
    return this.http
      .post(`${ENV.BASE_API}insight-views`, viewObj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting insight view count
  public insightViewsCount$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}ins-views-count/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //get event for getting insight comment count
  public insightCommentsCount$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}ins-comments-count/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for creating insight watch list
  public insightAddwatchlist$(viewObj) {
    return this.http
      .post(`${ENV.BASE_API}add-to-watchlist`, viewObj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting client insight rating
  public addInsightRating(rateObj) {
    return this.http
      .post(`${ENV.BASE_API}insight-client-rating`, rateObj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event getting insight rating 
  public getInsightRating(rateObj) {
    return this.http
      .post(`${ENV.BASE_API}get-insight-rating`, rateObj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Error Handling Function 
  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.router.navigate(['/auth/login']);
    }
    return Observable.throw(errorMsg);
  }

}


