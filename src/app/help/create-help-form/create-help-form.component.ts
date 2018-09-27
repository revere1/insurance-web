import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HelpFormService } from './../../services/help/help-form.service';
import { HelpModel, FormHelpModel } from './../../models/help.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { HelpService } from './../../services/help.service';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { ENV } from './../../env.config';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

declare var $: any;
@Component({
  selector: 'app-create-help-form',
  templateUrl: './create-help-form.component.html',
  styleUrls: ['./create-help-form.component.css']
})
export class CreateHelpFormComponent implements OnInit {
  @Input() event: HelpModel;
  isEdit: boolean;
  helpForm: FormGroup;
  public apiEvents = [];
  // Model storing initial form values
  formEvent: FormHelpModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: HelpModel;
  public submitting: boolean;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public uploadFilesObj = {};
  public uploadFiles = [];
  public canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};
  private descriptionLimitChars = 100;
  tickerInd = ENV['$'];
  analystInd = ENV['@'];
  InsightInd = ENV['#'];
  public totalsize: number = 0.0;
  private tryingToPaste = false;
  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private router: Router,
    private _helpapi: HelpService,
    public cf: HelpFormService,
    public toastr: ToastsManager,
    private _auth: AuthService,
  ) {
    this.helpForm = new FormGroup({
      subject: new FormControl(),
      description: new FormControl()
    });
    _auth.loadSession();
  }

  ngOnInit() {
    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    $(document).ready(() => {
      let _that = this;
      $('#description').summernote({
        toolbar: ENV.SUMMER_SETUP.toolbar,
        callbacks: {
          onPaste: function (e) {
            _that.tryingToPaste = true;
          },
          onCreateLink: function (originalLink) {
            return originalLink; // return original link 
          },
          onImageUpload: function (files) {
            if (_that.tryingToPaste) {
              _that.tryingToPaste = false;
              return false;
            }
            else
              _that.uploadFile(files, this);
          },
        },
        //hint: that.utils.hint()
      });
    });

    let that = this;
    this.config = {
      url: ENV.BASE_API + 'problems/path?token=' + this._helpapi.getToken(),
      maxFiles: ENV.HELP_MAX_FILES,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
        this.on("addedfile", function (file) {
          that.totalsize += parseFloat((file.size / (1024 * 1024)).toFixed(2));
        });
        this.on('removedfile', function (file) {
          /*If reupload already existed file, don t delet the file if max lik=mit crossed error uploaded*/
          if (file.status === 'error') {
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              return false;
            }
          }
          /*end*/
          if (that.canRemove) {
            that.totalsize -= parseFloat((file.size / (1000 * 1000)).toFixed(2));
            //Removing values from array which are existing in uploadFiles variable         
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              if (that.uploadFiles.length === ENV.HELP_MAX_FILES) {
                that.formErrors['files'] = '';
                that._setErrMsgs(that.helpForm.get('files'), that.formErrors, 'files');
              }
              (that.uploadFiles).splice(index, 1);
              that.removeFile(that.uploadFilesObj[file.upload.uuid]);
              delete that.uploadFilesObj[file.upload.uuid];
            }
          }
        });
        this.on('error', function (file, errorMessage) {
          drop.removeFile(file);
        });
        this.on('success', function (file) {
        });
      },
      /* Check for total all files size*/
      accept: function (file, done) {
        if (that.totalsize <= ENV.HELP_MAX_SIZE) {
          done();
        } else {
          done('Total size exceeded');
        }
      }
    };
  }

  uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._helpapi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }
  private removeFile(file) {
    let apiEvent = this._helpapi.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.helpForm.get('files'), this.formErrors, 'files');
  }
  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.helpForm.get('files'), this.formErrors, 'files');
  }
  private _buildForm() {
    let validRules = {
      subject: [this.formEvent.subject, [
        Validators.required
      ]],
      description: [this.formEvent.description, [
        // Validators.required
      ]]
    };
    this.helpForm = this.fb.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.helpForm
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
      _markDirty(this.helpForm);
    }
    this._onValueChanged();
  }
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormHelpModel(null, null, null, null, null, []);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormHelpModel(
        this.event.subject,
        this.event.description,
        this.event.resolvedBy,
        this.event.createdBy,
        this.event.updatedBy,
        this.event.files
      );
    }
  }
  private _onValueChanged() {
    if (!this.helpForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.helpForm.get(field), this.formErrors, field);
      }
    }
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.cf.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };
  resetForm() {
    this.helpForm.reset();
    $("#description").summernote("reset")
  }
  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new HelpModel(
      this.helpForm.get('subject').value,
      $('#description').summernote('code'),
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.id : null,
      this.event ? this.event.status : 'Pending',
      this.event ? this.event.files : this.uploadFiles,
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
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
  saveHelp() {
    if ($('#description').next('.note-editor').find('.note-editable').text().length < this.descriptionLimitChars) {
      this.formErrors['description'] = this.cf.validationMessages['description'].required;
      this._setErrMsgs(this.helpForm.get('description'), this.formErrors, 'description');
      return false;
    }
    else {
      this.formErrors['description'] = '';
      this._setErrMsgs(this.helpForm.get('description'), this.formErrors, 'description');
    }

    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._helpapi
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => {
            this._handleSubmitSuccess(data);
            this.canRemove = false;
            this.router.navigate(['/help']);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}

