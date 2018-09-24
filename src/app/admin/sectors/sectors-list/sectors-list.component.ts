import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from './../../../env.config';
import { SectorsService } from '../../../services/sectors.service';
import { UtilsService } from '../../../services/utils.service';
import { SectorModel } from '../../../models/sector.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';
class Sectors {
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
  selector: 'app-sectors-list',
  templateUrl: './sectors-list.component.html',
  styleUrls: ['./sectors-list.component.css']
})
export class SectorsListComponent implements OnInit {

  private allItems: {};
  public dtOptions: DataTables.Settings = {};
  public error: boolean;
  public apiEvents = [];
  public bcList: IBreadcrumb[];
  public sectors: Sectors[];

  constructor(
    private http: HttpClient,
    private _sectorsService: SectorsService,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager
  ) {
    this.meta.addTag({ name: 'description', content: 'All the list of sectors' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'sectors, revere, equity' });
  }

  ngOnInit() {
    this.bcList = [{ label: 'Home', url: 'home', params: [] }, { label: 'Sectors', url: 'sectors', params: [] }];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(() => {
          let apiEvent = this._sectorsService.filterSectors$(dataTablesParameters, 'filterSectors')
            .subscribe(resp => {
              that.sectors = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
          (this.apiEvents).push(apiEvent);
        }, 1000, false);
        myEfficientFn();
      },
      columns: [
        { data: 'name' },
        { data: 'status' },
        { data: 'id' }
      ]
    };
  }

  download() {
    this._sectorsService.getSector$()
      .subscribe(data => {
        this.allItems = this.sectors;
        var options = {
          headers: ['ID', 'Name', 'Status', 'CreatedBy', 'UpdatedBy', 'CreatedAt', 'UpdatedAt']
        };
        new Angular2Csv(this.allItems, 'SectorList', options);
      });
  }

  public deletesector(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {

      let apiEvent = this._sectorsService.deleteSectorById$(id)
        .subscribe(
          data => this._handleSubmitSuccess(data, id),
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  
  private _handleSubmitSuccess(res, id = 0) {
    this.error = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.sectors.map(function (e) { return e.id; }).indexOf(id);
      this.sectors.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
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
