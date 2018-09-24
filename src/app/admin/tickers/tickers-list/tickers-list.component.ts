import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from './../../../env.config';
import { TickerService } from '../../../services/ticker.service';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';


class Ticker {
  name: string;
  company: string;
  industry: string;
  sector: string;
  id: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};
  private allItems: {};
  public tickers: Ticker[];
  public error: boolean;
  public apiEvents = [];
  public submit: boolean = false;
  public bcList: IBreadcrumb[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _tickerApi: TickerService,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager
  ) {
    this.meta.addTag({ name: 'description', content: 'All the list of tickers' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'tickers, revere, equity' });
  }
  ngOnInit(): void {
    this.bcList = [{ label: 'Home', url: 'home', params: [] }, { label: 'Tickers', url: 'tickers', params: [] }];
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
          let apiEvent = this._tickerApi.filterTickers$(dataTablesParameters, 'filterTickers')
            .subscribe(resp => {
              that.tickers = resp.data;
              that.submit = true;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
          (this.apiEvents).push(apiEvent);
        }, 1000, true);
        myEfficientFn();
      },

      columns: [
        { data: 'name' },
        { data: 'company' },
        { data: 'countryId' },
        { data: 'industry' },
        { data: 'sectorId' },
        { data: 'createdBy' },
        { data: 'market_cap' },
        { data: 'id' }
      ]
    };
  }
  download() {
    this._tickerApi.gettickers$()
      .subscribe(data => {
        //API data
        this.allItems = this.tickers;
        var options = {
          headers: ['ID', 'Name', 'Company', 'Industry', 'Market_cap', 'Sector',
            'Country', 'CreatedBy']
        };
        new Angular2Csv(this.allItems, 'TickersList', options);
      });
  }
  public deleteTicker(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._tickerApi.deleteTickerById$(id)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  private _handleSubmitSuccess(res, id = 0) {
    this.error = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.tickers.map(function (e) { return e.id; }).indexOf(id);
      this.tickers.splice(pos, 1);
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
      });
    }
  }
}
