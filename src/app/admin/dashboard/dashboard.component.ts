import { Component, OnInit } from '@angular/core';

import { ScriptService } from '../../services/script.service';
import { DashboardService } from '../../services/dashboard.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi } from '../../services/charts/client-chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  //<-------charts Begin ---------/>
  ngxData: any = {};
  submitting: boolean;
  single: any[];
  multi: any[];
  view: any[] = [600, 300];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Years';
  showYAxisLabel = true;
  yAxisLabel = 'Users';
  colorScheme = {
    domain: ['#A10A28','#5AA454', '#C7B42C', '#AAAAAA']
  };
  // line, area
  autoScale = true;
  //<-------charts End ---------/>
  public clients: number = 0;
  public analysts: number = 0;
  public tickers: number = 0;

  constructor(public script: ScriptService, private dashbrdService: DashboardService) {
    this.ngxData = {
      data: [
        {
          name: 'Clients',
          series: []
        },
        {
          name: 'Analysts',
          series: []

        },
        {
          name: 'Ticker',
          series: []
        }
      ]
    };
    this.loadAssets();
    this.loadCounts();
    this.loadDayCounts();
    Object.assign(this, { single, multi })
  }

  loadCounts() {
    this.dashbrdService.fetchCounts().subscribe(data => {
      if (data.success) {
        this.clients = data.data.clients;
        this.analysts = data.data.analysts;
        this.tickers = data.data.tickers;
      }
    });
  }

  // Graph Chart Display
  loadDayCounts() {
    this.submitting = true;
    this.dashbrdService.fetchDayCounts().subscribe(datacount => {
      if (datacount.success) {
        for (let c = 0; c < datacount.datacount.dayclients.length; c++) {
          this.ngxData.data[0].series.push({ name: datacount.datacount.dayclients[c].name, value: datacount.datacount.dayclients[c].value });
        }
        for (let a = 0; a < datacount.datacount.dayanalysts.length; a++) {
          this.ngxData.data[1].series.push({ name: datacount.datacount.dayanalysts[a].name, value: datacount.datacount.dayanalysts[a].value });
        }
        this.submitting = false;
      }
    }, (err) => {
      this.submitting = false;
    });
  }
  // Graph Chart Display End

  loadAssets() {
    this.script.load('raphael', 'morris', 'dashboard').then(data => {
    }).catch(error => console.log(error));
  }

}
