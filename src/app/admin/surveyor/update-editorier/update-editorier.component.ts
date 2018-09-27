import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from './../../../services/user.service';
import { UtilsService } from './../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-update-editorier',
  templateUrl: './update-editorier.component.html',
  styleUrls: ['./update-editorier.component.css']
})
export class UpdateEditorierComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  public loading: boolean;
  editorierSub: Subscription;
  editorier: UserModel;
  public error: boolean;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private _userapi: UserService,
    private breadcrumbsService: BreadcrumbsService,
    public utils: UtilsService,
  ) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Editoriers', url: 'editoriers', params: [] },
      { label: 'Update', url: 'update', params: [] }
    ];
    this.utils.changeBreadCrumb(bcList);
    this.utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.title.setTitle(this.pageTitle);
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getClient();
      });
  }

  private _getClient() {
    this.loading = true;
    this.editorierSub = this._userapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          if (res.success) {
            this.editorier = res.data;
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  public ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.editorierSub.unsubscribe();
  }

}
