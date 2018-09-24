import { Component, OnInit } from '@angular/core';
import { UtilsService } from './../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { SectorModel } from './../../../models/sector.model';
import { SectorsService } from './../../../services/sectors.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from 'ng2-breadcrumbs';


@Component({
  selector: 'app-update-sector',
  templateUrl: './update-sector.component.html',
  styleUrls: ['./update-sector.component.css']
})
export class UpdateSectorComponent implements OnInit {

  public sectors: SectorModel;
  private id: number;
  routeSub: Subscription;
  public loading: boolean;
  public sectorsSub: Subscription;
  public error: boolean;

  constructor(private route: ActivatedRoute,
    private _sectorsapi: SectorsService,
    private breadcrumbsService: BreadcrumbsService,
    public utils: UtilsService) { }

  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] }, { label: 'Sectors', url: 'sectors', params: [] },
    { label: 'Update', url: 'update', params: [] }];
    this.utils.changeBreadCrumb(bcList);
    this.utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getSectors();
      });
  }

  private _getSectors() {
    this.loading = true;
    this.sectorsSub = this._sectorsapi
      .getSectorById$(this.id)
      .subscribe(
        res => {
          if (res.success) {
            this.sectors = res.data;
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
    this.sectorsSub.unsubscribe();
  }
}

