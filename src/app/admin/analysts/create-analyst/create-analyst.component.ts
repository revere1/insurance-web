import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-analyst',
  templateUrl: './create-analyst.component.html',
  styleUrls: ['./create-analyst.component.css']
})
export class CreateAnalystComponent implements OnInit {

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
      { label: 'Analysts', url: 'analysts', params: [] },
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
