import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { TickerModel } from './../models/ticker.model';
@Injectable()
export class TickerService {

  private currentUser: any;
  
  constructor(private http: HttpClient, private router: Router) { }

  //Passing for token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Get event for getting tickers list
  public gettickers$() {
    return this.http
      .get(`${ENV.BASE_API}tickers`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // Get event for getting ticker based on id
  public getUserById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}ticker/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event for ticker
  public postEvent$(event) {
    return this.http
      .post(`${ENV.BASE_API}ticker`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for  filter tickes
  public filterTickers$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Tiker Update Event
  public editEvent$(id, event) {
    return this.http
      .put(`${ENV.BASE_API}ticker/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete Ticker event
  public deleteTickerById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}ticker/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // Error Handling Function 
  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.router.navigate(['/auth/login']);
    }
    return Observable.throw(errorMsg);
  }

}
