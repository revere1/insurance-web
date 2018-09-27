import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from './../../env.config';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';
class Contact {
  id: number;
  name: string;
  status: string;
  createdBy: number
  updatedBy: number
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-contact-us-list',
  templateUrl: './contact-us-list.component.html',
  styleUrls: ['./contact-us-list.component.css']
})
export class ContactUsListComponent implements OnInit {

  private allItems: {};
  public  dtOptions: DataTables.Settings = {};
  public error: boolean;
  public apiEvents = [];
  public bcList: IBreadcrumb[];
  public contacts: Contact[];
  
  constructor(
    private http: HttpClient,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager
  ) {
    this.meta.addTag({ name: 'description', content: 'All the list of contacts' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'contacts, revere, equity' });
  }

  ngOnInit() {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Contact-Us' , url: 'contact-us-list', params: []}];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    const that = this;
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   serverSide: true,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     var myEfficientFn = this._utils.debounce(() => {
    //       let apiEvent = this._sectorsService.filterContacts$(dataTablesParameters, 'filterContacts')
    //         .subscribe(resp => {
    //           that.contacts = resp.data;
    //           callback({
    //             recordsTotal: resp.recordsTotal,
    //             recordsFiltered: resp.recordsFiltered,
    //             data: []
    //           });
    //         });
    //       (this.apiEvents).push(apiEvent);
    //     }, 1000, false);
    //     myEfficientFn();
    //   },
    //   columns: [
    //     { data: 'name' },
    //     { data: 'mobile' },
    //     { data: 'comment' },
    //     { data: 'id' }
    //   ]
    // };
  }
  download() {
    this.allItems = this.contacts;
    var options = {
      headers: ['ID', 'Name', 'Mobile', 'Email', 'Comments']
    };
    new Angular2Csv(this.allItems, 'ContactUsList', options);
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.error = true;
  }
  public ngonDestory() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}