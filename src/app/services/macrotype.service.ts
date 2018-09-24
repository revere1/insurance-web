import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { RegionsModel } from '../admin/regions/regions.component';
import { CurrencyModel } from '../admin/currency/currency.component';

@Injectable()
export class MacroTypeService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //post event for Getting All regions or currency
  getRegorCurrency(table: string) {
    return this.http.post(`${ENV.BASE_API}regionsOrcurrency`, { 'tblName': table }, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
      .catch(this._handleError);
  }

  //Post event for Getting region or currency based on id
  getRegorCurrencyById$(id: number, table: string) {
    return this.http
      .post(`${ENV.BASE_API}regionOrcurrency/${id}`, { 'tblName': table }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for filtering Regions or Currency
  filterRegorCurrency$(filterInput, endPoint, table: string) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, { 'filterInput': filterInput, 'tblName': table }, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Put event for updating region or currency 
  editEvent$(id: number, event: RegionsModel, table: string): Observable<RegionsModel> {
    return this.http
      .put(`${ENV.BASE_API}regionOrcurrency/${id}`, { 'event': event, 'tblName': table }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for creating region or currency 
  postEvent$(SubmitingRecord, table: string) {
    return this.http
      .post(`${ENV.BASE_API}regionOrcurrency`, { 'event': SubmitingRecord, 'tblName': table }, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Deleting region or currency Based on Id
  deleteRegorCurrencyById$(id: number, table: string): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}regionOrcurrency/${id}/${table}`, {
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
