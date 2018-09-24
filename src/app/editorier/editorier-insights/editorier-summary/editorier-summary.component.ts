import { Component, OnInit, Input, ViewChild, OnDestroy, Output, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { EventEmitter } from '@angular/core'
import { ComposeModel, FormComposeModel } from '../../../models/compose.model';
import { ComposeFormService } from '../../../services/compose/compose-form.service';
import { ComposeService } from '../../../services/compose.service';
import { ENV } from '../../../env.config';
import { InsightService } from '../../../services/insights/insight.service';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';
declare var $: any;
@Component({
  selector: 'app-editorier-summary',
  templateUrl: './editorier-summary.component.html',
  styleUrls: ['./editorier-summary.component.css']
})
export class EditorierSummaryComponent implements OnInit {

  @Input() event: ComposeModel;
  private isEdit: boolean;
  private tryingToPaste = false;
  private apiEvents = [];
  // Model storing initial form values
  private formEvent: FormComposeModel;
  private formChangeSub: Subscription;
  private submittingObj: any;
  // Form submission
  private submitEventObj: any;
  private submitEventSub: Subscription;
  private routeSub: Subscription;
  private currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private uploadFilesObj = {};
  private uploadFiles = [];
  private finished: boolean = false;
  public canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};
  public insightsData: any;
  public serverURL = ENV.SERVER_URL;
  public tickerInd = ENV['$'];
  public analystInd = ENV['@'];
  public InsightInd = ENV['#'];
  public autosave: boolean = true;
  public SummaryForm: FormGroup;
  // Form validation and disabled logic
  public formErrors: any;
  public submitting: boolean;
  public error: boolean;
  public submitBtnText: string;
  public id: number;
  public type: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _utils: UtilsService,
    private _route: ActivatedRoute,
    private _composeFormService: ComposeFormService,
    private _composeApi: ComposeService,
    private _toastr: ToastsManager
  ) {
    this.SummaryForm = new FormGroup({
      headline: new FormControl(),
      summary: new FormControl(),
      description: new FormControl()
    });
  }

  ngOnInit() {
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
        this.type = params['type'];
      });
    let apiEvent = this._composeApi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
      }
      else {
        this.finished = true;
        this.insightsData = data.data;
        this.type = this.insightsData.type
        this.SummaryForm.controls['headline'].patchValue(this.insightsData.headline);
        this.SummaryForm.controls['summary'].patchValue(this.insightsData.summary);
        this.SummaryForm.controls['description'].patchValue(this.insightsData.description);
        {
          $(document).ready(() => {
            let _that = this
            $('#description').summernote({
              onPaste: function (e) {
                _that.tryingToPaste = true;
              },
              toolbar: ENV.SUMMER_SETUP.toolbar,
              buttons: {
                hello: this._saveButton
              },
              onImageUpload: function (files) {

                if (_that.tryingToPaste) {
                  _that.tryingToPaste = false;
                  return false;
                }
                else
                  _that._uploadFile(files, this);
              },
              onCreateLink: function (originalLink) {
                return originalLink; // return original link 
              },
              hint: _that._utils.hint()
            });
            $('#summary').summernote({
              toolbar: ENV.SUMMER_SETUP.toolbar,
              buttons: {
                hello: this._saveButton
              },
              onCreateLink: function (originalLink) {
                return originalLink; // return original link 
              },
              hint: _that._utils.hint()
            });
          });
        }
      }
    });
    (this.apiEvents).push(apiEvent);
    this.submitBtnText = 'Continue';
    this.formErrors = this._composeFormService.formErrors;
    this._buildForm();
  };

  private _uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._composeApi.uploads(formData).subscribe(res => {
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
      headline: [Validators.required],
      summary: [Validators.required],
      description: [Validators.required],
    };
    this.SummaryForm = this._formBuilder.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.SummaryForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    (this.apiEvents).push(apiEvent);
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.SummaryForm);
    }
    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.SummaryForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.SummaryForm.get(field), this.formErrors, field);
      }
    }
  }

  private _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this._composeFormService.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };

  public resetForm() {
    this.SummaryForm.reset();
    $("#summary").summernote("reset")
    $("#description").summernote("reset")
  };

  private _getSubmitObj() {
    return this.submittingObj = {
      'headline': this.SummaryForm.get('headline').value,
      'summary': $('#summary').summernote('code'),
      'description': $('#description').length ? $('#description').summernote('code') : null,
      'updatedBy': this.currentUserId
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this._toastr.success(res.message, 'Success');
    }
    else {
      this._toastr.error(res.message, 'Invalid');
    }
  };

  private _handleSubmitError(err) {
    this._toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };

  private _saveButton = function (context) {
    let that = this;
    var ui = $.summernote.ui;
    var button = ui.button({
      contents: '<i class="fa fa-child"/> Hello',
      tooltip: 'hello',
      click: function () {
        let apiEvent = this.postEvent()
      }
    });
    return button.render();
  };

  private _postEvent() {
    this.submitEventObj = this._getSubmitObj();
    delete this.submitEventObj.status
    this.submitEventSub = this._composeApi
      .editEvent$(this.id, this.submitEventObj)
      .subscribe(
        data => {
        },
    );
  }

  public saveSummary() {
    this.autosave = false;
    if ($('#summary').summernote('isEmpty')) {
      this.formErrors['summary'] = this._composeFormService.validationMessages['summary'].required;
      this._setErrMsgs(this.SummaryForm.get('summary'), this.formErrors, 'summary');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.SummaryForm.get('summary'), this.formErrors, 'summary');
    }
    if (this.insightsData.type == 'in-depth') {
      if ($('#description').summernote('isEmpty')) {
        this.formErrors['description'] = this._composeFormService.validationMessages['description'].required;
        this._setErrMsgs(this.SummaryForm.get('description'), this.formErrors, 'description');
        return false;
      }
      else {
        this.formErrors['description'] = '';
        this._setErrMsgs(this.SummaryForm.get('description'), this.formErrors, 'description');
      }
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._composeApi
        .editEvent$(this.id, this.submitEventObj)
        .subscribe(
          data => {
            this.canRemove = false;
            this._router.navigate(["editorier/insights/preview", this.id]);
            this._handleSubmitSuccess(data);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }

  public ngOnDestroy() {
    if (this.autosave == true) {
      let apiEvent = this._postEvent()
    }
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}
