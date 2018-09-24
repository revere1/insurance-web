import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { DatePipe } from '@angular/common';

@Injectable()
export class DashboardService {

  public now: Date = new Date();
  private currentUser: any;
  private currentDate: any;
  private previousYearDate: any;

  constructor(private http: HttpClient, private router: Router,
    private datePipe: DatePipe, ) {
    this.currentDate = this.datePipe.transform(this.now, "yyyy-MM-dd")
    let past = this.now.setFullYear(this.now.getFullYear() - 1);
    this.previousYearDate = this.datePipe.transform(past, "yyyy-MM-dd")
  }
  
  //Passing token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      return this.currentUser.token;
    }
    return 'revere';
  }

  // POST event for getting counts
  fetchCounts() {
    return this.http
      .post(`${ENV.BASE_API}fetch-counts`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting day wise count of users
  public fetchDayCounts() {
    return this.http
      .post(`${ENV.BASE_API}daywise-counts`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //event for getting ticker data from private Api
  public fetchData(ticker) {
    return this.http
      .get(`https://www.quandl.com/api/v3/datasets/WIKI/${ticker}.json?start_date=${this.previousYearDate}&end_date=${this.currentDate}&api_key=EaYFf8c8XHw6M4KWPbZm`, {
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
