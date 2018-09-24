import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { CountriesModel } from './../models/countries.model';
@Injectable()
export class CountriesService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  // POST event for creating country
  public postEvent$(event: CountriesModel): Observable<CountriesModel> {
    return this.http
      .post(`${ENV.BASE_API}countries`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for filtering countries
  public filterCountries$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //delete event for deleting country based on Id
  public deleteCountryById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}countries/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event for updating countries
  public editEvent$(id: number, event: CountriesModel): Observable<CountriesModel> {
    return this.http
      .put(`${ENV.BASE_API}countries/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //get event for getting all countries
  public getCountries$() {
    return this.http
      .get(`${ENV.BASE_API}countries`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET event for getting country based on id
  public getCountryById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}countries/${id}`, {
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
