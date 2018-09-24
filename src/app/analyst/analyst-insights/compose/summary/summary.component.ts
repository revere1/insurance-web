import { Component, OnInit, Input, ViewChild, OnDestroy, Output, NgModule, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ComposeFormService } from './../../../../services/compose/compose-form.service';
import { ComposeModel, FormComposeModel } from './../../../../models/compose.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ComposeService } from './../../../../services/compose.service';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { ENV } from './../../../../env.config';
import { InsightService } from '../../../../services/insights/insight.service';
import { UserService } from '../../../../services/user.service';
import { UtilsService } from '../../../../services/utils.service';

declare var $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() event: ComposeModel;
  @ViewChild('fileInput') fileInput;
  private isEdit: boolean;
  private apiEvents = [];
  // Model storing initial form values
  private formEvent: FormComposeModel;
  private formChangeSub: Subscription;
  // Form submission
  private submitEventObj: ComposeModel;
  private routeSub: Subscription;
  private pageSwithed: boolean = false;
  private uploadFilesObj = {};
  private uploadFiles = [];
  private finished: boolean = false;
  private summaryLimitChars = 200;
  private descriptionLimitChars = 500;
  private filesToUpload: Array<File> = [];
  private submitEventSub: Subscription;
  private tryingToPaste = false;
  public error: boolean;
  public insight_img: any;
  public submitBtnText: string;
  public id: number;
  public type: any;
  public insightsData: any;
  public insights = [];
  public tickerInd = ENV['$'];
  public analystInd = ENV['@'];
  public InsightInd = ENV['#'];
  public totalsize: number = 0.0;
  public test: string = "test";
  public autosave: boolean = true;
  public SummaryForm: FormGroup;
  public serverURL = ENV.SERVER_URL;
  // Form validation and disabled logic
  public formErrors: any;
  public submitting: boolean;
  public canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _utils: UtilsService,
    private _router: Router,
    private _insightApi: InsightService,
    private _userApi: UserService,
    private _route: ActivatedRoute,
    private _composeFormService: ComposeFormService,
    private _composeApi: ComposeService,
    public toastr: ToastsManager
  ) {
    this.SummaryForm = new FormGroup({
      headline: new FormControl(),
      summary: new FormControl(),
      description: new FormControl()
    });
  }

  private _pasteImg() {
    let that = this;
    that._utils.isPastedEvent(".note-editable", paste => {
      if (!paste) that.tryingToPaste = true;
    });
    $('.note-editable').bind('paste', null, function () {
      that.tryingToPaste = true;
    });
  }

  ngOnInit() { 
    setInterval(() => {
      if (!this.pageSwithed)
        this._postEvent();
    }, 20000);
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
        this.type = params['type'];
      });
    if (this.event && this.event['insight_img'] !== undefined) {
      this.insight_img = this.event['insight_img'];
    }
    let apiEvent = this._composeApi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
      }
      else {
        this.finished = true;
        this.insightsData = data.data;
        this.insight_img = (this.insightsData.insight_img) ? ENV.SERVER_URL + this.insightsData.insight_img : null;
        this.insightsData.insight_attachements.forEach(ele => {
          this.totalsize += parseFloat(ele.fsize);
        });
        this.type = this.insightsData.type
        this.SummaryForm.controls['headline'].patchValue(this.insightsData.headline);
        this.SummaryForm.controls['summary'].patchValue(this.insightsData.summary);
        this.SummaryForm.controls['description'].patchValue(this.insightsData.description);
        {
          let _that = this;
          $(document).ready(() => {
            $('#description').summernote({
              toolbar: ENV.SUMMER_SETUP.toolbar,
              buttons: {
                save: this._SaveButton(_that)
              },
              callbacks: {
                onPaste: function (e) {
                  _that.tryingToPaste = true;
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
              }
            });
            $('#summary').summernote({
              toolbar: ENV.SUMMER_SETUP.toolbar,
              buttons: {
                save: this._SaveButton(_that)
              },
              callbacks: {
                onPaste: function (e) {
                  _that.tryingToPaste = true;
                },
                onImageUpload: function (files) {
                  if (_that.tryingToPaste) {
                    _that.tryingToPaste = false;
                    return false;
                  }
                  else
                    _that._uploadFile(files, this);
                }
              },
              onCreateLink: function (originalLink) {
                return originalLink; // return original link 
              },
              hint: _that._utils.hint()
            });
          });
        }
      }
      if (this.insightsData.status == 'published') {
        this.autosave = false;
        this._router.navigate(['/analyst/insights/compose/preview', this.insightsData.id]);
        this.toastr.success('Already Published insight', 'Success');
      }
    });
    (this.apiEvents).push(apiEvent);
    this.formErrors = this._composeFormService.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = 'Continue';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'insight/path?token=' + this._composeApi.getToken(),
      maxFiles: ENV.HELP_MAX_FILES,
      maxFilesize: ENV.HELP_MAX_SIZE,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
        this.on("addedfile", function (file) {
          that.totalsize += parseFloat((file.size / (1000 * 1000)).toFixed(2));
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
                that._setErrMsgs(that.SummaryForm.get('files'), that.formErrors, 'files');
              }
              (that.uploadFiles).splice(index, 1);
              that._removeFile(that.uploadFilesObj[file.upload.uuid]);
              delete that.uploadFilesObj[file.upload.uuid];
            }
          }
        });
        this.on('error', function (file, errorMessage) {
          drop._removeFile(file);
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

  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.SummaryForm.get('files'), this.formErrors, 'files');
  };

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.SummaryForm.get('files'), this.formErrors, 'files');
  };

  private _buildForm() {
    let validRules = {
      headline: [this.formEvent.headline, [
        Validators.required
      ]],
      summary: [this.formEvent.summary, [
      ]],
      description: [this.formEvent.description, [
      ]],
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

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormComposeModel(null, null, null, null, null, null, []);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormComposeModel(
        this.event.headline,
        this.event.summary,
        this.event.bullbear,
        this.event.description,
        this.event.createdBy,
        this.event.updatedBy,
        this.event.files
      );
    }
  };

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

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    return new ComposeModel(
      this.SummaryForm.get('headline').value,
      $('#summary').summernote('code'),
      null,
      $('#description').length ? $('#description').summernote('code') : null,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      (this.insightsData.status == 'remodify') ? 'remodify' : 'preview',
      this.event ? this.event.files : this.uploadFiles,
      this.event ? this.event.id : null,
    );
  };

  private _SaveButton = function (context) {
    var ui = $.summernote.ui;
    var button = ui.button({
      contents: '<i class="fa fa-floppy-o" aria-hidden="true"></i>',
      tooltip: 'save',
      click: function () {
        let apiEvent = context.postEvent()
      }
    });
    return button.render();
  };

  public change() {
    this._router.navigateByUrl(`/analyst/insights/compose/choose-type/${this.id}`);
  };

  public navigation() {
    if (this.insightsData.status == 'preview') {
      this._router.navigateByUrl(`/analyst/insights/compose/preview/${this.id}`);
    } else {
      this._router.navigateByUrl(`/analyst/insights/compose/summary/${this.id}`);
    }
  };

  private _postEvent() {
    this.submitEventObj = this._getSubmitObj();
    delete this.submitEventObj.status
    delete this.submitEventObj.type
    let fileBrowser = this.fileInput.nativeElement;
    let formData = new FormData();
    if (fileBrowser.files && fileBrowser.files[0]) {
      formData.append("insight_img", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
    }
    for (let k in this.submitEventObj) {
      formData.append(k, this.submitEventObj[k]);
    }
    let apiEvent = this.submitEventSub = this._composeApi
      .editEvent$(this.id, this.submitEventObj)
      .subscribe(
        data => {
        },
        err => this._handleSubmitError(err)
      );
    (this.apiEvents).push(apiEvent);
  }

  public deleteInsightAttachment(id: number, fsize: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._composeApi.deleteInsAttachmentById$(id)
        .subscribe(
          data => {
            this._handleSubmitSuccess1(data, id);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
      this.totalsize = this.totalsize - fsize;
    }
  }

  public saveSummary() {
    this.autosave = false;
    if ($('#summary').next('.note-editor').find('.note-editable').text().length < this.summaryLimitChars) {
      this.formErrors['summary'] = this._composeFormService.validationMessages['summary'].required;
      this._setErrMsgs(this.SummaryForm.get('summary'), this.formErrors, 'summary');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.SummaryForm.get('summary'), this.formErrors, 'summary');
    }
    if (this.insightsData.type == 'In-depth') {
      if ($('#description').next('.note-editor').find('.note-editable').text().length < this.descriptionLimitChars) {
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
    delete this.submitEventObj.type
    let fileBrowser = this.fileInput.nativeElement;
    let formData = new FormData();
    if (fileBrowser.files && fileBrowser.files[0]) {
      formData.append("insight_img", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
    }
    for (let k in this.submitEventObj) {
      formData.append(k, this.submitEventObj[k]);
    }
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._composeApi
        .editEvent$(this.id, formData)
        .subscribe(
          data => {
            this.canRemove = false;
            this._router.navigate(["analyst/insights/compose/preview", this.id]);
            this._handleSubmitSuccess(data);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }

  public navigation1() {
    if (this.id !== undefined) {
      this._router.navigateByUrl(`/analyst/insights/compose/pick-ticker/${this.type}/${this.id}`);
    } else {
      this._router.navigateByUrl(`/analyst/insights/compose/summary/${this.id}`);
    }
  };

  private _removeFile(file) {
    let apiEvent = this._composeApi.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  };
  public resetForm() {
    this.SummaryForm.reset();
    $("#summary").summernote("reset")
    $("#description").summernote("reset")
  };

  private _handleSubmitSuccess1(res, id = 0) {
    this.error = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.insights.map(function (e) { return e.id; }).indexOf(id);
      this.insights.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
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
  };

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };

  ngOnDestroy() {
    if (this.autosave == true) {
      var confirmMsg = confirm("Are u Sure Want to Save?");
      if (confirmMsg) {
        let apiEvent = this._postEvent()
      }
    }
    this.pageSwithed = true;
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}
