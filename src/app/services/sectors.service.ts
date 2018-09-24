import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { SectorModel } from './../models/sector.model';

@Injectable()
export class SectorsService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing for token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Get event for getting all sectors list
  public getSector$() {
    return this.http
      .get(`${ENV.BASE_API}sectors`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POSt event for filtering sectors
  public filterSectors$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POSt event for filtering contacts
  public filterContacts$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Deleting sector based on Id
  public deleteSectorById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}sectors/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for Creating sector
  public postEvent$(event: SectorModel): Observable<SectorModel> {
    return this.http
      .post(`${ENV.BASE_API}sectors`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event Updating Sector based on Id
  public editEvent$(id: number, event: SectorModel): Observable<SectorModel> {
    return this.http
      .put(`${ENV.BASE_API}sectors/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for sector based on id
  public getSectorById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}sectors/${id}`, {
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
