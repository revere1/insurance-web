import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BaseService {
    constructor(private http: HttpClient) { }

    //Loading Sidbar data
    public getData(dataUrl = '/assets/sidebar-menu.json'): Promise<any[]> {
        return this.http
            .get(dataUrl, {}).toPromise()
            .then(response => {
                return response;
            })
            .catch(this.handleError);
    }

    //Error handling function
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}