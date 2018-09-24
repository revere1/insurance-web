import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommodityService } from '../../../../services/insights/commodity.service';
import { ENV } from '../../../../env.config';
import { InsightService } from '../../../../services/insights/insight.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectorsService } from '../../../../services/sectors.service';
import { SubsectorsService } from '../../../../services/subsectors.service';
import { BaseService } from '../../../../services/basic.service';
import { MacroTypeService } from '../../../../services/macrotype.service';
declare var $: any;
@Component({
  selector: 'app-pick-ticker',
  templateUrl: './pick-ticker.component.html',
  styleUrls: ['./pick-ticker.component.css']
})
export class PickTickerComponent implements OnInit {

  private isEdit: boolean = false;
  private routeSub: Subscription;
  private id: number;
  public type: any;
  public tickers = [];
  public showMacroForm: boolean = false;
  public industry: boolean = false;
  public economic: boolean = false;
  public currency: boolean = false;
  public sectors: any;
  public subsectors: any;
  public regionsData: any;
  public insightData: any;
  public currencyData: any;
  public commodities: Array<Object>;

  constructor(
    private _formBuilder: FormBuilder,
    private _commodityApi: CommodityService,
    private _route: ActivatedRoute,
    private _sectorApi: SectorsService,
    private _subsectorApi: SubsectorsService,
    private _macroApi: MacroTypeService,
    private _baseApi: BaseService,
    private _insightApi: InsightService,
    private _toastr: ToastsManager,
    private _router: Router
  ) {
    this._getCommodities();
    this.routeSub = this._route.params
      .subscribe(params => {
        this.type = params['type'];
        if ((this.type == 'quick-note') || (this.type == 'In-depth') || (this.type == 'macro-type')) {
          if (this.type == 'macro-type') {
            this.showMacroForm = true;
            this.pickTickerForm.get('macro_type').setValidators([Validators.required]);
          } else {
            this.showMacroForm = false;
            this.pickTickerForm.get('macro_type').setValidators([]);
            this.pickTickerForm.get('regionId').setValidators([]);
            this.pickTickerForm.get('currencyId').setValidators([]);
            this.pickTickerForm.get('sectorId').setValidators([]);
            this.pickTickerForm.get('subsectorId').setValidators([]);
            this.pickTickerForm.get('commodityId').setValidators([Validators.required]);
            this.pickTickerForm.get('tickerId').setValidators([Validators.required]);
          }
        } else {
          this._router.navigateByUrl(`/analyst/insights/compose/choose-type`);
        }
      });
  }

  private _getCommodities() {
    this._commodityApi.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }

  public pickTickerForm: FormGroup = this._formBuilder.group({
    commodityId: [null],
    tickerId: [null],
    macro_type: [null],
    sectorId: [null],
    subsectorId: [null],
    regionId: [null],
    currencyId: [null],
  });

  ngOnInit() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.type = params['type'];
        this.id = params['id'];
        if (!this.id) {
          if (this.type == 'macro-type') {
            this.pickTickerForm.controls['macro_type'].patchValue('industry');
            this.changeFields('industry')
          }
        }
      });
    this._sectorApi.getSector$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.sectors = data.data;
      }
    });

    if (this.id !== undefined) {
      this.isEdit = true;
      if (this.type == 'macro-type') {
        this._insightApi.getInsightById$(this.id).subscribe(data => {
          this.pickTickerForm.controls['macro_type'].patchValue(data.data.macro_type);
          if (data.success == false) {
          } else {
            this.insightData = data.data
            if (this.insightData.macro_type == 'industry') {
              this.sectors = [{ 'id': data.data.sector.id, 'name': data.data.sector.name }];
              this.pickTickerForm.controls['sectorId'].patchValue(data.data.sector.id);
              this.subsectors = [{ 'id': data.data.subsector.id, 'name': data.data.subsector.name }];
              this.pickTickerForm.controls['subsectorId'].patchValue(data.data.subsector.id);
              this.industry = true;
            } else {
              if (this.insightData.macro_type == 'economic') {
                this.regionsData = [{ 'id': data.data.region.id, 'name': data.data.region.name }];
                this.pickTickerForm.controls['regionId'].patchValue(data.data.region.id);
                this.economic = true;
              } else {
                if (this.insightData.macro_type == 'currency') {
                  this.currencyData = [{ 'id': data.data.currency.id, 'name': data.data.currency.name }];
                  this.pickTickerForm.controls['currencyId'].patchValue(data.data.currency.id);
                  this.currency = true;
                }
              }
            }
            this._domLoad();
          }
        });
      } else {
        this._insightApi.getInsightById$(this.id).subscribe(data => {
          if (data.success == false) {
          } else {
            this._domLoad();
            this.insightData = data.data
            this.pickTickerForm.controls['commodityId'].patchValue(data.data.commodityId);
            this.tickers = [{ 'id': data.data.ticker.id, 'name': data.data.ticker.name }];
            this.pickTickerForm.controls['tickerId'].patchValue(data.data.ticker.id);
          }
        });
      }
    }
    else {
      this._domLoad();
    }
  };

  public sectorChange(sectorVal) {
    this._subsectorApi.getSubsector$(sectorVal).subscribe(data => {
      if (data.success === false) {
      } else {
        this.subsectors = data.data;
      }
    });
  }

  public changeFields(val) {
    if (val == 'industry') {
      this.industry = true;
      this.economic = false;
      this.currency = false;
      this.pickTickerForm.get('regionId').setValidators([]);
      this.pickTickerForm.get('currencyId').setValidators([]);
      this.pickTickerForm.get('sectorId').setValidators([Validators.required]);
      this.pickTickerForm.get('subsectorId').setValidators([Validators.required]);
      this.pickTickerForm.controls['regionId'].patchValue(null);
      this.pickTickerForm.controls['currencyId'].patchValue(null);
    } else {
      if (val == 'economic') {
        this.industry = false;
        this.economic = true;
        this.currency = false;
        this.pickTickerForm.get('sectorId').setValidators([]);
        this.pickTickerForm.get('subsectorId').setValidators([]);
        this.pickTickerForm.get('currencyId').setValidators([]);
        this.pickTickerForm.get('regionId').setValidators([Validators.required]);
        this.pickTickerForm.controls['sectorId'].patchValue(null);
        this.pickTickerForm.controls['subsectorId'].patchValue(null);
        this.pickTickerForm.controls['currencyId'].patchValue(null);
        this._macroApi.getRegorCurrency('region').subscribe(data => {
          if (data.success === false) {
          } else {
            this.regionsData = data.data;
          }
        })
      } else {
        if (val == 'currency') {
          this.pickTickerForm.get('currencyId').setValidators([Validators.required]);
          this.pickTickerForm.get('sectorId').setValidators([]);
          this.pickTickerForm.get('subsectorId').setValidators([]);
          this.pickTickerForm.get('regionId').setValidators([]);
          this.pickTickerForm.controls['sectorId'].patchValue(null);
          this.pickTickerForm.controls['subsectorId'].patchValue(null);
          this.pickTickerForm.controls['regionId'].patchValue(null);
          this.industry = false;
          this.economic = false;
          this.currency = true;
          this._macroApi.getRegorCurrency('currency').subscribe(data => {
            if (data.success === false) {
            } else {
              this.currencyData = data.data;
            }
          })
        }
      }
    }
  }
  
  public submit(formdata: any): void {
    if (!this.isEdit) {
      if (this.pickTickerForm.dirty && this.pickTickerForm.valid) {
        let formData = this.pickTickerForm.value;
        formData.createdBy = this._insightApi.getCurUser();
        formData.type = this.type;
        formData.status = 'commodity';
        this._insightApi.createInsight(formData)
          .subscribe(data => {
            if (data.success) {
              this._toastr.success(data.message, 'Success');
              this._router.navigateByUrl('/analyst/insights/compose/summary/' + data.id);
            }
            else {
              this._toastr.error(data.message, 'error');
            }
          });
      }
    } else {
      let formData = this.pickTickerForm.value;
      formData.createdBy = this._insightApi.getCurUser();
      formData.updatedBy = this._insightApi.getCurUser();
      formData.type = this.type;
      formData.status = 'commodity';
      this._insightApi.editEvent$(this.id, formData)
        .subscribe(data => {
          if (data.success) {
            this._toastr.success(data.message, 'Success');
            this._router.navigateByUrl('/analyst/insights/compose/summary/' + this.id);
          }
          else {
            this._toastr.error(data.message, 'error');
          }
        });
    }
  }
  navigation() {
    if (this.id !== undefined) {
      this._router.navigateByUrl(`/analyst/insights/compose/summary/${this.id}`);
    } else {
      this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${this.type}`);
    }
  }

  navigation1() {
    if (this.id !== undefined) {
      if (this.insightData.status == 'preview') {
        this._router.navigateByUrl(`/analyst/insights/compose/preview/${this.id}`);
      } else {
        this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${this.type}/${this.id}`);
      }
    } else {
      this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${this.type}`);
    }
  }

  private _domLoad() {
    let that = this;
    $(document).ready(() => {
      let select2Obj = $(".js-data-example-ajax").select2({
        minimumInputLength: 2,
        ajax: {
          url: ENV.BASE_API + "auto-search-tickers?token=" + this._insightApi.getToken(),
          dataType: 'json',
          data: function (params) {
            return {
              p: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            var data = $.map(data, function (obj) {
              obj.id = obj.id;
              obj.text = obj.sku;
              return obj;
            });
            params.page = params.page || 1;

            return {
              results: data,
              pagination: {
                more: (params.page * 30) < data.total_count
              }
            };
          },
          cache: true
        },
        escapeMarkup: function (markup) {
          return markup;
        }, // let our custom formatter work

      });
      select2Obj.on("select2:select", function (e) {
        that.pickTickerForm.patchValue({ 'tickerId': e.params.data.id });
      });
    });
  }

}
