import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { HelpModel } from './../models/help.model';
import { HelpCommentModel } from './../models/helpcomment.model';
@Injectable()
export class HelpService {
  
  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  // POST new event  for creating problem
  postEvent$(event: HelpModel): Observable<HelpModel> {
    return this.http
      .post(`${ENV.BASE_API}problems`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for problem comments
  public postEvents$(id: number, event: HelpCommentModel) {
    return this.http
      .post(`${ENV.BASE_API}problem_comments/${id}`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for filtering problems
  public filterProblems$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for uploading files
  public uploads(formData) {
    return this.http
      .post(`${ENV.BASE_API}help/files`, formData, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //event for getting current user Details
  public getUserId() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  //Put event for Upading readed problems update
  public updateAllUnread(pid, uid) {
    return this.http
      .put(`${ENV.BASE_API}problems-comments`, { problemId: pid, msgTo: uid }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Put event for updating problem based on Id
  public editEvent$(id: number, event: HelpModel): Observable<HelpModel> {
    return this.http
      .put(`${ENV.BASE_API}problems/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //get event for getting problems for a user based on Id
  public getHelpById$(createdBy: number) {
    return this.http
      .get(`${ENV.BASE_API}problems/${createdBy}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for getting problems reply based on Id
  public getHelpcommentById$(id: number, filterInput) {
    return this.http
      .post(`${ENV.BASE_API}problems_commentsreply/${id}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting comments 
  public getComment$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}problem-comment/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting user based on Id
  public getUserById$(createdBy: number, id: number) {
    return this.http
      .get(`${ENV.BASE_API}user/${createdBy}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting help count 
  public problemsCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-helpcounts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting problems user list
  public ProblemsUserList$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}problemUser-list/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting problems based on Id
  public problemById$(id: number): Observable<HelpModel> {
    return this.http
      .get(`${ENV.BASE_API}problems/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //delete event for deleting problem files
  public removeFile(file) {
    return this.http
      .delete(`${ENV.BASE_API}problems/remove-file`, {
        headers: new HttpHeaders()
          .set('Authorization', this._authHeader)
          .set('file', file)
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
