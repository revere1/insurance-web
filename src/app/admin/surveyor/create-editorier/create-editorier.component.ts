import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../../../services/utils.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-create-editorier',
  templateUrl: './create-editorier.component.html',
  styleUrls: ['./create-editorier.component.css']
})
export class CreateEditorierComponent implements OnInit {
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
      { label: 'Editoriers', url: 'editoriers', params: [] },
      { label: 'Create', url: 'create', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
  }

}
