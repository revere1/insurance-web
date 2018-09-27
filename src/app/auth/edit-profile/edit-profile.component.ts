import { Component, OnInit, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { CountriesService } from './../../services/countries.service';
import { StatesService } from './../../services/states.service';
import { EventEmitter } from '@angular/core'
import { ENV } from './../../env.config';
import { UserModel, UserFormModel } from '../../models/user.model';
import { UserFormService } from '../../services/users/user-form.service';
declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, AfterViewInit {

  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Input() event: UserModel;
  public isEdit: boolean;
  public authForm: FormGroup;
  public formData: any;
  // Model storing initial form values
  public formEvent: UserFormModel;
  // Form validation and disabled logic
  public formErrors: any;
  formChangeSub: Subscription;
  public file: any;
  // Form submission
  public submitEventObj: UserModel;
  public submitting: boolean;
  public submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];
  public subsectors: Object[];
  public countries: Object[];
  public companies: Object[];
  public states: Object[];
  public userAcesslevel: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public cf: UserFormService,
    private _userapi: UserService,
    private _stateService: StatesService,
    private _countriesrService: CountriesService,
    private elementRef: ElementRef,
    public toastr: ToastsManager
  ) { }


  ngOnChanges() {
    if (this.authForm !== undefined) {
      this.authForm.controls['profile_pic'].patchValue(this.event.profile_pic);
    }


  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
  }
  ngOnInit() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    this.userAcesslevel = currentUser.user.access_level
    $(document).ready(() => {
      let _that = this;
      $('#about').summernote({
        callbacks: {
          onImageUpload: function (files) {

            _that.uploadFile(files, this);
          }
        },
      });

    });
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
      Validators.required
      ],
      contact_number: [this.formEvent.contact_number,
      Validators.required
      ],
      company_name: [this.formEvent.company_name,
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
      profile_pic: [this.event.profile_pic,
      Validators.required
      ],
      about: [this.event.about,
      ],
      zip_code: [this.formEvent.zip_code,
      Validators.required
      ],
      access_level: [this.formEvent.access_level]
    };



    if (this.isEdit) {
      Object.assign(validRules, {
        password: [
          this.formEvent.password,
          Validators.required],
        confirm_password: [
          this.formEvent.confirm_password,
          Validators.required]
      }
      );
    }
    else {
      Object.assign(validRules, {
        password: [this.formEvent.password,
        Validators.required
        ],
        confirm_password: [this.formEvent.confirm_password,
        Validators.required
        ]
      }
      );
    }

    this.authForm = this.fb.group(validRules, { validator: this.checkPasswords });
    // Subscribe to form value changes
    this.formChangeSub = this.authForm
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
      _markDirty(this.authForm);
    }
    this._onValueChanged();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password,
      confirmPass = group.controls.confirm_password;
    return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  }

  private _onValueChanged() {
    if (!this.authForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.authForm.get(field), this.formErrors, field);
      }
    }
  }

  private _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.cf.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };




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
    this.authForm.controls['state_id'].patchValue(null);
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
        // this.sectorChange(this.event.sector_id)
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

  public uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._userapi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }

  private _getSubmitObj() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new UserModel(
      this.authForm.get('first_name').value,
      this.authForm.get('last_name').value,
      this.authForm.get('email').value,
      this.authForm.get('contact_number').value,
      this.authForm.get('password').value,
      this.authForm.get('confirm_password').value,
      this.authForm.get('company_url').value,
      this.authForm.get('company_name').value,
      null,
      (this.authForm.get('sector_id').value) ? this.authForm.get('sector_id').value : null,
      (this.authForm.get('subsector_id').value) ? this.authForm.get('subsector_id').value : null,
      (this.authForm.get('country_id').value) ? this.authForm.get('country_id').value : null,
      (this.authForm.get('state_id').value) ? this.authForm.get('state_id').value : null,
      this.authForm.get('city').value,
      this.authForm.get('zip_code').value,
      this.authForm.get('access_level').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      'active',
      this.event ? this.event.id : null,
      $('#about').summernote('code'),
      this.event ? this.event.profile_pic : null,

    );
  }

  saveClient() {

    if ($('#about').summernote('isEmpty')) {
      this.formErrors['about'] = this.cf.validationMessages['about'].required;
      this._setErrMsgs(this.authForm.get('about'), this.formErrors, 'about');
      return false;
    }
    else {
      this.formErrors['#about'] = '';
      this._setErrMsgs(this.authForm.get('about'), this.formErrors, 'about');
    }
    this.submitEventObj = this._getSubmitObj();
    this.submitting = true;
    if (!this.isEdit) {
      this.submitEventSub = this._userapi
        .postEvent$({ 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => {
            this._handleSubmitSuccess(data)

          },
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this._userapi
        .editEvent$(this.event.id, { 'data': JSON.stringify(this.submitEventObj) })
        .subscribe(
          data => {
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
      this.router.navigate(['/auth/login']);
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

  resetForm() {
    this.authForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }
}


