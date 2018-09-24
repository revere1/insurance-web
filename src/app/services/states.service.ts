import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { StatesModel } from './../models/states.model';
@Injectable()
export class StatesService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Get event for getting all states
  public getStates$() {
    return this.http
      .get(`${ENV.BASE_API}states`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting states based on search value
  public getState$(country_id: number) {
    return this.http
      .get(`${ENV.BASE_API}states?country_id=${country_id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for creating States
  public postEvent$(event: StatesModel): Observable<StatesModel> {
    return this.http
      .post(`${ENV.BASE_API}states`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only) for updating states
  public editEvent$(id: number, event: StatesModel): Observable<StatesModel> {
    return this.http
      .put(`${ENV.BASE_API}states/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for Filtering States
  public filterStates$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET event for getting state based on Id
  public getStatesById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}states/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // delete event for Deleting States
  public deleteStateById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}states/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
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
