import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { CountriesService } from '../../../services/countries.service';
import { StatesService } from '../../../services/states.service';
import { ENV } from '../../../env.config';
import { UserModel, UserFormModel } from '../../../models/user.model';
import { UserFormService } from '../../../services/users/user-form.service';
@Component({
  selector: 'app-tpacompanies-form',
  templateUrl: './tpacompanies-form.component.html',
  styleUrls: ['./tpacompanies-form.component.css']
})
export class TpacompaniesFormComponent implements OnInit {

  @Input() event: UserModel;
  isEdit: boolean;
  analystForm: FormGroup;
  public serverURL = ENV.SERVER_URL;
   //Model storing initial form values
  formEvent: UserFormModel;
   //Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
   //Form submission
  public submitEventObj: UserModel;
  submitting: boolean;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];
  public subsectors: Object[];
  public companies: Object[];
  public countries: Object[];
  public states: Object[];
  public company_logo: string;

  @ViewChild('fileInput') fileInput;
  constructor(private fb: FormBuilder,
    private router: Router,
    private _userapi: UserService,
    private _stateService: StatesService,
    private _countriesrService: CountriesService,
    public toastr: ToastsManager,
    public cf: UserFormService,
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
      company_id: [this.formEvent.company_id],
      sector_id: [this.formEvent.sector_id],
      subsector_id: [this.formEvent.subsector_id],
      country_id: [this.formEvent.country_id],
      state_id: [this.formEvent.state_id],
      city: [this.formEvent.city],
      zip_code: [this.formEvent.zip_code],
      access_level: [this.formEvent.access_level]
    };
    this.analystForm = this.fb.group(validRules);
     //Subscribe to form value changes
    this.formChangeSub = this.analystForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
     //If edit: mark fields dirty to trigger immediate
     //validation in case editing an event that is no
     //longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.analystForm);
    }
    this._onValueChanged();
  }

  checkPasswords(group: FormGroup) { 
     //here we have the 'passwords' group
    let pass = group.controls.password,
      confirmPass = group.controls.confirm_password;
    return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  }

  private _onValueChanged() {
    if (!this.analystForm) { return; }
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

     //Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        _setErrMsgs(this.analystForm.get(field), this.formErrors, field);
      }
    }
  }

 

  // public sectorChange1(sectorVal) {
  //   this.analystForm.controls['subsector_id'].patchValue(null);
  //   this.sectorChange(sectorVal)
  // }

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
    this.analystForm.controls['state_id'].patchValue(null);
    this.countryChange(sectorVal)
  }

  private _setFormEvent() {
    if (!this.isEdit) {
       //If creating a new event, create new
      // FormEventModel with default null data
      return new UserFormModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'Analyst');
    } else {
       //If editing existing event, create new
       //FormEventModel from existing data
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
     //to JS dates and populate a new EventModel for submission
    return new UserModel(
      this.analystForm.get('first_name').value,
      this.analystForm.get('last_name').value,
      this.analystForm.get('email').value,
      this.analystForm.get('contact_number').value,
      ENV.DEFAULT_PWD,
      null,
      null,
      null,
      (this.analystForm.get('company_id').value) ? this.analystForm.get('company_id').value : null,
      (this.analystForm.get('sector_id').value) ? this.analystForm.get('sector_id').value : null,
      (this.analystForm.get('subsector_id').value) ? this.analystForm.get('subsector_id').value : null,
      (this.analystForm.get('country_id').value) ? this.analystForm.get('country_id').value : null,
      (this.analystForm.get('state_id').value) ? this.analystForm.get('state_id').value : null,
      this.analystForm.get('city').value,
      this.analystForm.get('zip_code').value,
      this.analystForm.get('access_level').value,
      currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.status : 'pending',
      this.event ? this.event.id : null
    );
  }

  saveAnalyst() {
    this.submitting = true;
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
    this.submitting = false;
     //Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/analysts']);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.analystForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }
  
}
