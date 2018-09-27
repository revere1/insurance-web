import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { CountriesService } from './../../../services/countries.service';
import { StatesService } from './../../../services/states.service';
import { ENV } from './../../../env.config';
import { UtilsService } from '../../../services/utils.service';
import { UserModel, UserFormModel } from '../../../models/user.model';
import { UserFormService } from '../../../services/users/user-form.service';
import { AuthService } from '../../../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeForm: EventEmitter<any> = new EventEmitter<any>();
  @Input() event: UserModel;
  private isEdit: boolean;
  private formData: any;
  // Model storing initial form values
  private formEvent: UserFormModel;
  private formChangeSub: Subscription;
  private file: any;
  // Form submission
  private submitEventObj: UserModel;
  private submitting: boolean;
  private submitEventSub: Subscription;
  public userProfileForm: FormGroup;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];
  public companies: Object[];
  public subsectors: Object[];
  public countries: Object[];
  public states: Object[];
  // Form validation and disabled logic
  public formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _userFormService: UserFormService,
    private _utils: UtilsService,
    private _userApi: UserService,
    private _stateApi: StatesService,
    private _countriesApi: CountriesService,
    private _auth: AuthService,
    public toastr: ToastsManager
  ) {
    _auth.loadSession();
  }

  ngOnInit() {
    $(document).ready(() => {
      let _that = this;
      $('#about').summernote({
        callbacks: {
          onImageUpload: function (files) {
            _that._uploadFile(files, this);
          }
        },
      });
    });
    this.formErrors = this._userFormService.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();

    //Fetch Countries
    this._countriesApi.getCountries$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.countries = data.data;
      }
    });
  }

  private _uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._userApi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
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
      Validators.required
      ],
      contact_number: [this.formEvent.contact_number,
      Validators.required
      ],
      company_id: [this.formEvent.company_id],
      company_url: [this.formEvent.company_url,
      Validators.required
      ],
      sector_id: [this.formEvent.sector_id,
      Validators.required
      ],
      subsector_id: [this.formEvent.subsector_id,
      Validators.required
      ],
      country_id: [this.formEvent.country_id,
      Validators.required
      ],
      state_id: [this.formEvent.state_id,
      Validators.required
      ],
      city: [this.formEvent.city,
      Validators.required
      ],
      about: [this.formEvent.about,
        null],
      zip_code: [this.formEvent.zip_code,
      Validators.required
      ],
      access_level: [this.formEvent.access_level]
    };
    this.userProfileForm = this._formBuilder.group(validRules);
    // Subscribe to form value changes
    this.formChangeSub = this.userProfileForm
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
      _markDirty(this.userProfileForm);
    }
    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.userProfileForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.userProfileForm.get(field), this.formErrors, field);
      }
    }
  }

  private _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this._userFormService.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };


  public sectorChange1(sectorVal) {
    this.userProfileForm.controls['subsector_id'].patchValue(null);
  }

  public countryChange(countryVal) {
    if (countryVal !== 'null') {
      this._stateApi.getState$(countryVal).subscribe(data => {
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
    this.userProfileForm.controls['state_id'].patchValue(null);
    this.countryChange(sectorVal)
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new UserFormModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'Client');
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      if (this.event.sector_id) {
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
        this.event.access_level,
        this.event.about,
      );
    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new UserModel(
      this.userProfileForm.get('first_name').value,
      this.userProfileForm.get('last_name').value,
      this.userProfileForm.get('email').value,
      this.userProfileForm.get('contact_number').value,
      null,
      null,
      this.userProfileForm.get('company_url').value,
      null,
      (this.userProfileForm.get('company_id').value) ? this.userProfileForm.get('company_id').value : null,
      (this.userProfileForm.get('sector_id').value) ? this.userProfileForm.get('sector_id').value : null,
      (this.userProfileForm.get('subsector_id').value) ? this.userProfileForm.get('subsector_id').value : null,
      (this.userProfileForm.get('country_id').value) ? this.userProfileForm.get('country_id').value : null,
      (this.userProfileForm.get('state_id').value) ? this.userProfileForm.get('state_id').value : null,
      this.userProfileForm.get('city').value,
      this.userProfileForm.get('zip_code').value,
      this.userProfileForm.get('access_level').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      'active',
      this.event ? this.event.id : null,
      $('#about').summernote('code'),
    );
  }

  public updateProfile() {
    if ($('#about').summernote('isEmpty')) {
      this.formErrors['about'] = this._userFormService.validationMessages['about'].required;
      this._setErrMsgs(this.userProfileForm.get('about'), this.formErrors, 'about');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.userProfileForm.get('about'), this.formErrors, 'about');
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._userApi
        .postEvent$({ 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this._userApi
        .editEvent$(this.event.id, { 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => {
            let that = this;
            this._utils.updateUserSession(data.data);
            $('.hidden-xs,.user-name').each(function () {
              $(this).text(data.data.first_name + ' ' + data.data.last_name)
            });
            this._handleSubmitSuccess(data)
          },
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
      this.edit.emit();
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

  public resetForm() {
    this.userProfileForm.reset();
  }

  public cancel() {
    this.closeForm.emit();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}


