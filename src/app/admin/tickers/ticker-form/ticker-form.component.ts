import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TickerFormService } from './../../../services/tickers/ticker-form.service';
import { TickerService } from './../../../services/ticker.service';
import { TickerModel, FormTickerModel } from './../../../models/ticker.model';
import { Subscription } from 'rxjs/Subscription';
import { SectorsService } from '../../../services/sectors.service';
import { CountriesService } from '../../../services/countries.service';
import { ENV } from '../../../env.config';
declare var $: any;

@Component({
  selector: 'app-ticker-form',
  templateUrl: './ticker-form.component.html',
  styleUrls: ['./ticker-form.component.css']
})
export class TickerFormComponent implements OnInit {

  @Input() event: TickerModel;
  public isEdit: boolean;
  tickerForm: FormGroup;
  // Model storing initial form values
  formEvent: FormTickerModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: TickerModel;
  public submitting: boolean;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];
  public countries: Object[];


  constructor(private fb: FormBuilder,
    private router: Router,
    public tickerformservice: TickerFormService,
    private _tickerapi: TickerService,
    private _sectorService: SectorsService,
    private _countriesrService: CountriesService,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      let _that = this;
      $('#about').summernote({
        toolbar: ENV.SUMMER_SETUP.toolbar,
      });
    });
    this.formErrors = this.tickerformservice.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();
    //Fetch sectors
    this._sectorService.getSector$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.sectors = data.data;
      }
    });
    //Fetch Countries
    this._countriesrService.getCountries$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.countries = data.data;
      }
    });
  }

  private _buildForm() {
    let validRules = {
      name: [this.formEvent.name, [
        Validators.required
      ]],
      company: [this.formEvent.company, [
        Validators.required
      ]],
      industry: [this.formEvent.industry,
      Validators.required
      ],
      sectorId: [this.formEvent.sectorId,
      Validators.required
      ],
      company_url: [this.formEvent.company_url],
      countryId: [this.formEvent.countryId],
      listing_exchange: [this.formEvent.listing_exchange,
      Validators.required
      ],
      currency: [this.formEvent.currency],
      market_cap: [this.formEvent.market_cap,
        //Validators.required, Validators.pattern["0-9*"]
      ],
      share_in_issue: [this.formEvent.share_in_issue, Validators.required, Validators.pattern["0-9*"]
      ],
      fiftytwo_week_high: [this.formEvent.fiftytwo_week_high, Validators.pattern["0-9*"]],
      fiftytwo_week_low: [this.formEvent.fiftytwo_week_low, Validators.pattern["0-9*"]],
      avg_volume: [this.formEvent.avg_volume, Validators.pattern["0-9*"]],
      about: [this.formEvent.about, [
        // Validators.required
      ]],

    };
    this.tickerForm = this.fb.group(validRules);

    // Subscribe to form value changes
    this.formChangeSub = this.tickerForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.tickerForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.tickerForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.tickerForm.get(field), this.formErrors, field);
      }
    }
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.tickerformservice.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormTickerModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      return new FormTickerModel(
        this.event.name,
        this.event.company,
        this.event.industry,
        this.event.sectorId,
        this.event.countryId,
        this.event.company_url,
        this.event.listing_exchange,
        this.event.currency,
        this.event.market_cap,
        this.event.share_in_issue,
        this.event.fiftytwo_week_high,
        this.event.fiftytwo_week_low,
        this.event.avg_volume,
        this.event.about,
        this.event.createdBy,
        this.event.updatedBy
      );
    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);

    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new TickerModel(
      this.tickerForm.get('name').value,
      this.tickerForm.get('company').value,
      this.tickerForm.get('industry').value,
      this.tickerForm.get('sectorId').value,
      this.tickerForm.get('countryId').value,
      this.tickerForm.get('company_url').value,
      this.tickerForm.get('listing_exchange').value,
      this.tickerForm.get('currency').value,
      this.tickerForm.get('market_cap').value,
      this.tickerForm.get('share_in_issue').value,
      this.tickerForm.get('fiftytwo_week_high').value,
      this.tickerForm.get('fiftytwo_week_low').value,
      this.tickerForm.get('avg_volume').value,
      $('#about').summernote('code'),
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.id : null
    );
  }

  saveClient() {
    if ($('#about').summernote('isEmpty')) {
      this.formErrors['about'] = this.tickerformservice.validationMessages['about'].required;
      this._setErrMsgs(this.tickerForm.get('about'), this.formErrors, 'about');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.tickerForm.get('about'), this.formErrors, 'about');
    }

    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._tickerapi
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this._tickerapi
        .editEvent$(this.event.id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/tickers']);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };
  resetForm() {
    this.tickerForm.reset();
    $("#about").summernote("reset")
  };

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
