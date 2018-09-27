import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { CountriesService } from '../../../services/countries.service';
import { StatesService } from '../../../services/states.service';
import { ENV } from './../../../env.config';
import { UserModel, UserFormModel } from '../../../models/user.model';
import { UserFormService } from '../../../services/users/user-form.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {

  @Input() event: UserModel;
  public isEdit: boolean;
  clientForm: FormGroup;
  // Model storing initial form values
  formEvent: UserFormModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: UserModel;
  submitting: boolean = false;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];
  public subsectors: Object[];
  public countries: Object[];
  public states: Object[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _userapi: UserService,
    private _stateService: StatesService,
    private _countriesrService: CountriesService,
    public cf: UserFormService,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();

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
      first_name: [this.formEvent.first_name, [
        Validators.required
      ]],
      last_name: [this.formEvent.last_name, [
        Validators.required
      ]],
      email: [this.formEvent.email,
      [Validators.required, Validators.email]
      ],
      contact_number: [this.formEvent.contact_number,
      Validators.required
      ],
      company_name: [this.formEvent.company_name],
      company_url: [this.formEvent.company_url],
      sector_id: [this.formEvent.sector_id],
      subsector_id: [this.formEvent.subsector_id],
      country_id: [this.formEvent.country_id],
      state_id: [this.formEvent.state_id],
      city: [this.formEvent.city],
      zip_code: [this.formEvent.zip_code],
      access_level: [this.formEvent.access_level]
    };
    this.clientForm = this.fb.group(validRules);
    this.formChangeSub = this.clientForm
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
      _markDirty(this.clientForm);
    }
    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.clientForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.cf.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        _setErrMsgs(this.clientForm.get(field), this.formErrors, field);
      }
    }
  }



  public countryChange(countryVal) {
    if (countryVal !== 'null') {
      this._stateService.getState$(countryVal).subscribe(data => {
        if (data.success === false) {
        } else {
          this.states = data.data;
        }
      });
    }
    else {
      this.states = [];
    }
  }

  public countryChange1(sectorVal) {
    this.clientForm.controls['state_id'].patchValue(null);
    this.countryChange(sectorVal)
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new UserFormModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'Admin');
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      if (this.event.sector_id) {
        //this.sectorChange(this.event.sector_id)
      }
      if (this.event.country_id) {
        this.countryChange(this.event.country_id)
      }
      return new UserFormModel(
        this.event.first_name,
        this.event.last_name,
        this.event.email,
        this.event.contact_number,
        this.event.password,
        this.event.confirm_password,
        this.event.company_url,
        this.event.company_name,
        this.event.company_id,
        this.event.sector_id,
        this.event.subsector_id,
        this.event.country_id,
        this.event.state_id,
        this.event.city,
        this.event.zip_code,
        this.event.access_level
      );
    }
  }


  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new UserModel(
      this.clientForm.get('first_name').value,
      this.clientForm.get('last_name').value,
      this.clientForm.get('email').value,
      this.clientForm.get('contact_number').value,
      ENV.DEFAULT_PWD,
      null,
      this.clientForm.get('company_url').value,
      this.clientForm.get('company_name').value,
      null,
      (this.clientForm.get('sector_id').value) ? this.clientForm.get('sector_id').value : null,
      (this.clientForm.get('subsector_id').value) ? this.clientForm.get('subsector_id').value : null,
      (this.clientForm.get('country_id').value) ? this.clientForm.get('country_id').value : null,
      (this.clientForm.get('state_id').value) ? this.clientForm.get('state_id').value : null,
      this.clientForm.get('city').value,
      this.clientForm.get('zip_code').value,
      this.clientForm.get('access_level').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.status : 'pending',
      this.event ? this.event.id : null
    );
  }

  saveManagement() {
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._userapi
        .postEvent$({ 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      delete this.submitEventObj.password
      this.submitEventSub = this._userapi
        .editEvent$(this.event.id, { 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/management']);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.error = true;
  }

  resetForm() {
    this.clientForm.reset();
  }

 public  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
