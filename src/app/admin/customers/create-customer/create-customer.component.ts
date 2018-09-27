import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {
  pageTitle = 'Create Event';

  constructor(private title: Title,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Clients', url: 'clients', params: [] },
      { label: 'Create', url: 'create', params: [] }
    ];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.title.setTitle(this.pageTitle);
  }
}
