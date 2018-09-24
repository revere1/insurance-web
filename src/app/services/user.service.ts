import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { ContactUsModel } from '../models/contact_us.model';

@Injectable()
export class UserService {

  private currentUser: any;
  
  constructor(private http: HttpClient, private router: Router) { }

  //Passing for token of current user
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      return this.currentUser.token;
    } else {
      return 'revere';
    }
  }

  //Get event for global search for analysts
  public elasticAnalysts(term) {
    return this.http
      .get(`${ENV.BASE_API}elastic/analysts?term=` + term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET list of public, future events
  public getUserById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}user/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for users based on company name
  public getUsersByCompany$(companyId: any) {
    return this.http
      .get(`${ENV.BASE_API}users/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for users
  public getClient$() {
    return this.http
      .get(`${ENV.BASE_API}users`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event (admin only)
  public postEvent$(event) {
    return this.http
      .post(`${ENV.BASE_API}user`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event (admin only)
  public filterUsers$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete event for deleting for Client
  public deleteClientById$(id: number): Observable<number> {
    return this.http
      .delete(`${ENV.BASE_API}user/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting Current User
  public getCurUserId() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  // POST new event (admin only)
  public postEvents$(event) {
    return this.http
      .post(`${ENV.BASE_API}privillage`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only)
  public editEvent$(id: number, event) {
    return this.http
      .put(`${ENV.BASE_API}user/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for privillages 
  public getPrivillageById$(userId: number) {
    return this.http
      .get(`${ENV.BASE_API}privillage/${userId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting analyst follower
  public analystFollowers$(obj) {
    return this.http
      .post(`${ENV.BASE_API}analyst-follower`, obj, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting Admins list
  public getUserList(val) {
    return this.http
      .post(`${ENV.BASE_API}adminlist`, { 'acceslevel': val }, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //User profile pic upload event
  public upload(formData) {
    return this.http
      .post(`${ENV.BASE_API}user/profile-pic`, formData, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //User about files uploads event
  public uploads(formData) {
    return this.http
      .post(`${ENV.BASE_API}user/about-files`, formData, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // Global search event
  public globalSearch(term) {
    return this.http
      .get(`${ENV.BASE_API}search?term=` + term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // Contact Us post Event
  public ContactusPostEvent$(event: ContactUsModel) {
    return this.http
      .post(`${ENV.BASE_API}contact-us`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // Post Event for Getting Access Level 
  public getRoleByAccess$(id) {
    return this.http
      .post(`${ENV.BASE_API}role`, { 'acessLevel': id }, {
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
