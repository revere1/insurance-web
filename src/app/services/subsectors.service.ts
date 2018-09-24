import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { SubSectorModel } from './../models/sub-sector.model';
@Injectable()
export class SubsectorsService {

  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { }

  //Passing for token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  //Get event for getting subsectors list
  public getsubSector$() {
    return this.http
      .get(`${ENV.BASE_API}subsectors`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting subsector based on Id
  public getSubsector$(sector_id: number) {
    return this.http
      .get(`${ENV.BASE_API}subsector?sector_id=${sector_id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event for Creating Subsector
  public postEvent$(event: SubSectorModel): Observable<SubSectorModel> {
    return this.http
      .post(`${ENV.BASE_API}subsector`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only) or update Subsector event
  public editEvent$(id: number, event: SubSectorModel): Observable<SubSectorModel> {
    return this.http
      .put(`${ENV.BASE_API}subsector/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST event for filtering Subsectors
  public filterSubSector$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET event for getting subsector based on id
  public getSubSectorById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}subsector/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete event  for deleting subsector
  public deleteSubSectorById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}subsector/${id}`, {
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
