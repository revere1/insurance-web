import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from './../../../services/user.service';
import { UtilsService } from './../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UserModel } from '../../../models/user.model';


@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrls: ['./update-admin.component.css']
})
export class UpdateAdminComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  public loading: boolean;
  public clientSub: Subscription;
  public admin: UserModel;
  public error: boolean;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private _userapi: UserService,
    public utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService
  ) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Admins', url: 'management', params: [] },
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
    this.clientSub = this._userapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          if (res.success) {
            this.admin = res.data;
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.clientSub.unsubscribe();
  }

}
