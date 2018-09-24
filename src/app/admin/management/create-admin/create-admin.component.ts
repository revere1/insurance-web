import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../../../services/utils.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

  pageTitle = 'Create Event';

  constructor(
    private title: Title,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService
  ) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Admins', url: 'management', params: [] },
      { label: 'Create', url: 'create', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.title.setTitle(this.pageTitle);
  }

}
