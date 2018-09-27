import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  loading: boolean;
  clientSub: Subscription;
  client: UserModel;
  error: boolean;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private _userapi: UserService,
    private breadcrumbsService: BreadcrumbsService,
    public utils: UtilsService
  ) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [
      { label: 'Home', url: 'home', params: [] },
      { label: 'Clients', url: 'clients', params: [] },
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
            this.client = res.data;
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
