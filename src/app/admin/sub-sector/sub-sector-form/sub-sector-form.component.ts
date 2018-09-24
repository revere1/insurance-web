import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SubSectorModel, SubSectorsFormModel } from './../../../models/sub-sector.model';
import { SubsectorsService } from '../../../services/subsectors.service';
import { SubSectorFormService } from './../../../services/sub-sectors/sub-sector-form.service';
import { Subscription } from 'rxjs/Subscription';
import { SectorsService } from '../../../services/sectors.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-sub-sector-form',
  templateUrl: './sub-sector-form.component.html',
  styleUrls: ['./sub-sector-form.component.css']
})
export class SubSectorFormComponent implements OnInit {

  @Input() event: SubSectorModel;
  isEdit: boolean;
  subSectorsForm: FormGroup;
  // Model storing initial form values
  formEvent: SubSectorsFormModel;

  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;

  // Form submission
  submitEventObj: SubSectorModel;
  submitting: boolean;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public sectors: Object[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ssf: SubSectorFormService,
    private _sectorsService: SectorsService,
    private _subSectorrService: SubsectorsService,
    public toastr: ToastsManager) {
    this.subSectorsForm = new FormGroup({
      name: new FormControl(),
      sector: new FormControl,
      status: new FormControl()
    });
  }

  ngOnInit() {
    this.formErrors = this.ssf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();

    //Fetch Countries
    this._sectorsService.getSector$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.sectors = data.data;
      }
    });
  }

  private _buildForm() {
    let validRules = {
      name: [this.formEvent.name, [
        Validators.required
      ]],
      sector: [this.formEvent.sector_id, [
        Validators.required
      ]],
      status: [this.formEvent.status,
      Validators.required
      ],
    };
    this.subSectorsForm = this.fb.group(validRules);

    // Subscribe to form value changes
    this.formChangeSub = this.subSectorsForm
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
      _markDirty(this.subSectorsForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.subSectorsForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ssf.validationMessages[field];
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
        _setErrMsgs(this.subSectorsForm.get(field), this.formErrors, field);
      }
    }
  }


  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new SubSectorModel(null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new SubSectorsFormModel(
        this.event.sector_id,
        this.event.name,
        this.event.status,
        this.event.createdBy,
        this.event.updatedBy,
      );
    }
  }

  private _getSubmitObj() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new SubSectorModel(
      this.subSectorsForm.get('sector').value,
      this.subSectorsForm.get('name').value,
      this.subSectorsForm.get('status').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.id : null
    );
  }

  saveSubSector() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._subSectorrService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      let curUserObj = localStorage.getItem('currentUser');
      let currentUser = JSON.parse(curUserObj);
      this.submitEventSub = this._subSectorrService
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
      this.router.navigate(['/admin/sub-sector']);
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
    this.subSectorsForm.reset();
  }

}
