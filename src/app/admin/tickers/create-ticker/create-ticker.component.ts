import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-ticker',
  templateUrl: './create-ticker.component.html',
  styleUrls: ['./create-ticker.component.css']
})
export class CreateTickerComponent implements OnInit {

  pageTitle = 'Create Event';
  public bcList: IBreadcrumb[];
  constructor(
    private title: Title,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Tickers', url: 'tickers', params: [] },
      { label: 'Create', url: 'create', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/

    this.title.setTitle(this.pageTitle);
  }

}
