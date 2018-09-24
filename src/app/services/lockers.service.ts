import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { LockerModel } from './../models/locker.model';
@Injectable()
export class LockersService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  // POST event for creating lockers
  public postEvent$(event: LockerModel): Observable<LockerModel> {
    return this.http
      .post(`${ENV.BASE_API}lockers`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting locker based on Id
  public getLockerById$(id: number): Observable<LockerModel> {
    return this.http
      .get(`${ENV.BASE_API}lockers/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for Filtering lockers
  public filterLockers$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET event getting lockers based on user Id
  public getUser$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}usersalllocker/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event for updating locker
  public editEvent$(id: number, event: LockerModel): Observable<LockerModel> {
    return this.http
      .put(`${ENV.BASE_API}lockers/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //event for getting current user details
  public getCurUserId() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  //delete event for remove lockers file
  public removeFile(file) {
    return this.http
      .delete(`${ENV.BASE_API}lockers/remove-file`, {
        headers: new HttpHeaders()
          .set('Authorization', this._authHeader)
          .set('file', file)
      })
      .catch(this._handleError);
  }

  //Get event getting locker types
  getLockerTypes() {
    return this.http.get(`${ENV.BASE_API}locker-types`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
      .catch(this._handleError);
  }
  
  //post event for locker count
  lockersCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-lockercounts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
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
