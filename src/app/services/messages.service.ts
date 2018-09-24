import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { MessagesModel } from './../models/messages.model';
import { AdminMessageModel } from '../models/admin-message.module';
import { Subscription, Subject } from 'rxjs';
@Injectable()
export class MessagesService {

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

  // POST new event (admin only)
  postEvent$(event: MessagesModel): Observable<MessagesModel> {
    return this.http
      .post(`${ENV.BASE_API}messages`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for saving reply message
  postEventForReply$(id: number, event: AdminMessageModel) {
    return this.http
      .post(`${ENV.BASE_API}reply/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete event for deleting messages files
  removeFile(file) {
    return this.http
      .delete(`${ENV.BASE_API}messages/remove-file`, {
        headers: new HttpHeaders()
          .set('Authorization', this._authHeader)
          .set('file', file)
      })
      .catch(this._handleError);
  }

  //getting current user deatils
  getCurUserId() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  //post event for getting Messages count
  messagesCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-counts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for updating read messages
  updateIsRead$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}update-isRead/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting Message Users List
  MessagesUserList$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}messageUser-list/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post Event for Message based on Id
  messageById$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}message/${id}`, { userId: this.getCurUserId() }, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Post event for getting Latest message baesd on Id
  latestMessageById$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}latestmessage/${id}`, { userId: this.getCurUserId() }, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //post event for filtering Messages
  filterMessages$(filterInput, endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Get event for getting Reply Message based on id
  messageReplyById$(id: number): Observable<MessagesModel> {
    return this.http
      .get(`${ENV.BASE_API}messagereply/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Upload summer note images event
  uploads(formData) {
    return this.http
      .post(`${ENV.BASE_API}messages/summernote-img`, formData, {
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
