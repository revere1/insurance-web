declare var APP_VERSION: string;
import * as countries from 'emoji-flags';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import * as SvgSaver from 'svgsaver';
import { colorSets } from '../../assets/charts_builder/color-sets';
import { formatLabel } from '../../assets/charts_builder/label.helper';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {
  single,
  generateData,
  generateGraph,
} from '../../assets/charts_builder/data';
import chartGroups from '../../assets/charts_builder/chartTypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';


const monthName = new Intl.DateTimeFormat('en-us', { month: 'short' });
const weekdayName = new Intl.DateTimeFormat('en-us', { weekday: 'short' });

function multiFormat(value) {
  if (value < 1000) return `${value.toFixed(2)}ms`;
  value /= 1000;
  if (value < 60) return `${value.toFixed(2)}s`;
  value /= 60;
  if (value < 60) return `${value.toFixed(2)}mins`;
  value /= 60;
  return `${value.toFixed(2)}hrs`;
}


@Component({
  selector: 'app-charts-builder',
  templateUrl: './charts-builder.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./charts-builder.component.css', '../../../node_modules/@swimlane/ngx-ui/release/index.css']
})
export class ChartsBuilderComponent implements OnInit {
  title = 'csvTOjson works!';
  text: any;
  JSONData: any;
  allItems = [];
  curChart: string = 'bar-vertical';
  public dataVisable: boolean;
  colorVisible: boolean;
  dimVisiable: boolean;
  optsVisible: boolean;
  inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  }

  csvJSON(csvText) {
    var lines = csvText.split("\n");
    var result = [];
    this.single = [];
    var series = [];
    var t = [];
    var headers = lines[0].split(",");
    if (headers.length === 3) {
      let usedNames = [];
      for (let i = 1; i < lines.length - 1; i++) {
        let currentline = lines[i].split(",");
        if (t.length) {
          if (this.inArray(currentline[0], usedNames)) {
            var index = t.findIndex(p => p.name == currentline[0]);
            t[index].series.push({ 'name': currentline[1], 'value': currentline[2] });
            continue;
          }
        }
        usedNames.push(currentline[0]);
        t.push({ 'name': currentline[0], 'series': [{ 'name': currentline[1], 'value': currentline[2] }] });
      }
      this.dateData = t;
      this.dateDataWithRange = t;
    } else if (headers.length === 2) {
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j].replace('\r', '')] = currentline[j].replace('\r', '');
        }
        this.single = [...this.single, obj];
      }
    }
  }

  convertFile(input) {
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let text = reader.result;
      this.text = text;
      this.csvJSON(text);
    };
  }

  svgSaver = new SvgSaver();
  theme = 'dark';
  chartType: string;
  chartGroups: any[];
  chart: any;
  realTimeData: boolean = false;
  countries: any[];
  single: any;
  multi: any[];
  dateData: any[];
  dateDataWithRange: any[];
  graph: { links: any[], nodes: any[] };
  linearScale: boolean = false;
  range: boolean = false;

  view: any[];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;

  curves = {
    Basis: shape.curveBasis,
    'Basis Closed': shape.curveBasisClosed,
    Bundle: shape.curveBundle.beta(1),
    Cardinal: shape.curveCardinal,
    'Cardinal Closed': shape.curveCardinalClosed,
    'Catmull Rom': shape.curveCatmullRom,
    'Catmull Rom Closed': shape.curveCatmullRomClosed,
    Linear: shape.curveLinear,
    'Linear Closed': shape.curveLinearClosed,
    'Monotone X': shape.curveMonotoneX,
    'Monotone Y': shape.curveMonotoneY,
    Natural: shape.curveNatural,
    Step: shape.curveStep,
    'Step After': shape.curveStepAfter,
    'Step Before': shape.curveStepBefore,
    default: shape.curveLinear
  };
  // line interpolation
  curveType: string = 'Linear';
  curve: any = this.curves[this.curveType];
  interpolationTypes = [
    'Basis', 'Bundle', 'Cardinal', 'Catmull Rom', 'Linear', 'Monotone X',
    'Monotone Y', 'Natural', 'Step', 'Step After', 'Step Before'
  ];

  closedCurveType: string = 'Linear Closed';
  closedCurve: any = this.curves[this.closedCurveType];
  closedInterpolationTypes = [
    'Basis Closed', 'Cardinal Closed', 'Catmull Rom Closed', 'Linear Closed'
  ];

  colorSets: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selectedColorScheme: string;
  rangeFillOpacity: number = 0.15;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;

  // line, area
  autoScale = true;
  timeline = false;

  // margin
  margin: boolean = false;
  marginTop: number = 40;
  marginRight: number = 40;
  marginBottom: number = 40;
  marginLeft: number = 40;

  lineChartScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
    ]
  };


  showRightYAxisLabel: boolean = true;
  yAxisLabelRight: string = 'Utilization';

  // demos
  totalSales = 0;
  salePrice = 100;
  personnelCost = 100;

  mathText = '3 - 1.5*sin(x) + cos(2*x) - 1.5*abs(cos(x))';
  mathFunction: (o: any) => any;

  treemap: any[];
  treemapPath: any[] = [];
  sumBy: string = 'Size';


  // Reference lines
  showRefLines: boolean = true;
  showRefLabels: boolean = true;

  // Supports any number of reference lines.
  refLines = [
    { value: 42500, name: 'Maximum' },
    { value: 37750, name: 'Average' },
    { value: 33000, name: 'Minimum' }
  ];

  constructor(public location: Location, private fb: FormBuilder) {
    this.mathFunction = this.getFunction();
    Object.assign(this, {
      single,
      countries,
      chartGroups,
      colorSets,
      graph: generateGraph(50)
    });
    this.dateData = generateData(5, false);
    this.dateDataWithRange = generateData(2, true);
    this.setColorScheme('cool');
  }

  get dateDataWithOrWithoutRange() {
    if (this.range) {
      return this.dateDataWithRange;
    } else {
      return this.dateData;
    }
  }
  clearAll() {
    this.single = [];
  }
  ngOnInit() {
    let state = this.curChart;
    this.selectChart(state.length ? state : 'bar-vertical');
    setInterval(this.updateData.bind(this), 1000);
    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  updateData() {
    if (!this.realTimeData) {
      return;
    }
    const country = this.countries[Math.floor(Math.random() * this.countries.length)];
    const add = Math.random() < 0.7;
    const remove = Math.random() < 0.5;

    if (remove) {
      if (this.single.length > 1) {
        const index = Math.floor(Math.random() * this.single.length);
        this.single.splice(index, 1);
        this.single = [...this.single];
      }

      if (this.multi.length > 1) {
        const index = Math.floor(Math.random() * this.multi.length);
        this.multi.splice(index, 1);
        this.multi = [...this.multi];
      }
      if (this.graph.nodes.length > 1) {
        const index = Math.floor(Math.random() * this.graph.nodes.length);
        const value = this.graph.nodes[index].value;
        this.graph.nodes.splice(index, 1);
        const nodes = [...this.graph.nodes];

        const links = this.graph.links.filter(link => {
          return link.source !== value && link.source.value !== value &&
            link.target !== value && link.target.value !== value;
        });
        this.graph = { links, nodes };
      }
    }

    if (add) {
      // single
      const entry = {
        name: country.name,
        value: Math.floor(10000 + Math.random() * 50000)
      };
      this.single = [...this.single, entry];

      // multi
      const multiEntry = {
        name: country.name,
        series: [{
          name: '1990',
          value: Math.floor(10000 + Math.random() * 50000)
        }, {
          name: '2000',
          value: Math.floor(10000 + Math.random() * 50000)
        }, {
          name: '2010',
          value: Math.floor(10000 + Math.random() * 50000)
        }]
      };

      this.multi = [...this.multi, multiEntry];

      // graph
      const node = { value: country.name };
      const nodes = [...this.graph.nodes, node];
      const link = {
        source: country.name,
        target: nodes[Math.floor(Math.random() * (nodes.length - 1))].value,
      };
      const links = [...this.graph.links, link];
      this.graph = { links, nodes };
    }

    const date = new Date(Math.floor(1473700105009 + Math.random() * 1000000000));
    for (const series of this.dateData) {
      series.series.push({
        name: date,
        value: Math.floor(2000 + Math.random() * 5000)
      });
    }
    this.dateData = [...this.dateData];
    this.dateDataWithRange = generateData(2, true);
  }

  applyDimensions() {
    this.view = [this.width, this.height];
  }

  toggleFitContainer(event) {
    this.fitContainer = event;
    if (this.fitContainer) {
      this.view = undefined;
    } else {
      this.applyDimensions();
    }
  }

  selectChart(chartSelector) {
    this.chartType = chartSelector = chartSelector.replace('/', '');
    for (const group of this.chartGroups) {
      this.chart = group.charts.find(x => x.selector === chartSelector);
      if (this.chart) break;
    }

    this.linearScale = false;
    this.yAxisLabel = 'GDP Per Capita';
    this.xAxisLabel = 'Country';
    this.width = 700;
    this.height = 300;
    Object.assign(this, this.chart.defaults);
    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  getInterpolationType(curveType) {
    return this.curves[curveType] || this.curves['default'];
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  pieTooltipText({ data }) {
    const label = formatLabel(data.name);
    const val = formatLabel(data.value);
    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">$${val}</span>
    `;
  }

  getFunction(text = this.mathText) {
    try {
      text = `with (Math) { return ${this.mathText} }`;
      const fn = new Function('x', text).bind(Math);
      return (typeof fn(1) === 'number') ? fn : null;
    } catch (err) {
      return null;
    }
  }
  getFlag(country) {
    return this.countries.find(c => c.name === country).emoji;
  }
  getUrl() {
    if (this.chartType === 'bar-vertical' ||
      this.chartType === 'bar-horizontal' ||
      this.chartType === 'pie-chart') {
      return '/assets/sample_csv/Sample_CSV_List.csv'
    } else {
      return '/assets/sample_csv/line.csv'
    }
  }
}
