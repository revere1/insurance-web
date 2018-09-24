import { Component, OnInit, Input, Output, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder,FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HelpFormService } from './../../../../services/help/help-form.service';
import { InsightCommentModel, FormInsightCommentModel } from './../../../../models/insightcomment.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { ENV } from './../../../../env.config';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ComposeService } from '../../../../services/compose.service';

@Component({
  selector: 'app-analyst-insight-comments',
  templateUrl: './analyst-insight-comments.component.html',
  styleUrls: ['./analyst-insight-comments.component.css']
})
export class AnalystInsightCommentsComponent implements OnInit {

  @Input() event: InsightCommentModel;
  @Input() replyFor: any;
  @Output() UpdateReplyId: EventEmitter<any> = new EventEmitter<any>();
  private isEdit: boolean;
  private apiEvents = [];
  private routeSub: Subscription;
  private id: number;
  // Model storing initial form values
  private formEvent: FormInsightCommentModel;
  private formChangeSub: Subscription;
  private uploadFilesObj = {};
  private uploadFiles = [];
  // Form submission
  private submitEventObj: InsightCommentModel;
  private submitEventSub: Subscription;
  public submitting: boolean;
  public error: boolean;
  public submitBtnText: string;
  public reply: boolean;
  public canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};
  public insightsData: any;
  public insightcommentForm: FormGroup;
  // Form validation and disabled logic
  public formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _helpFormService: HelpFormService,
    private _composeApi: ComposeService,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    public utils: UtilsService
  ) {
    this.insightcommentForm = new FormGroup({
      comment: new FormControl()
    });
  }

  ngOnInit() {
    this.reply = false;
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'insightcomment/path?token=' + this._composeApi.getToken(),
      maxFiles: ENV.LOCKER_MAX_FILES,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
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
            //Removing values from array which are existing in uploadFiles variable         
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              if (that.uploadFiles.length === ENV.HELP_MAX_FILES) {
                that.formErrors['files'] = '';
                that._setErrMsgs(that.insightcommentForm.get('files'), that.formErrors, 'files');
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
      }
    };
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
    this._composeApi.getInsightById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.insightsData = data.data;
      }
      this.formEvent = this._setFormEvent();
      this._buildForm();
    });
    this.formErrors = this._helpFormService.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';
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
    this._setErrMsgs(this.insightcommentForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.insightcommentForm.get('files'), this.formErrors, 'files');
  }

  private _buildForm() {
    let validRules = {
      comment: [this.formEvent.comment, [
      ]]
    };
    this.insightcommentForm = this._formBuilder.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.insightcommentForm
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
      _markDirty(this.insightcommentForm);
    }
    this._onValueChanged();
  }

  private _removeFile(file) {
    let apiEvent = this._composeApi.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormInsightCommentModel(null, null, null, null, null, []);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormInsightCommentModel(
        this.event.comment,
        this.event.parent,
        this.event.is_read,
        this.event.insightId,
        this.event.from,
        this.event.files
      );
    }
  }
  
  private _onValueChanged() {
    if (!this.insightcommentForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.insightcommentForm.get(field), this.formErrors, field);
      }
    }
  }

  private _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this._helpFormService.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };

  public resetForm() {
    this.insightcommentForm.reset();
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new InsightCommentModel(
      this.insightcommentForm.get('comment').value,
      this.replyFor,
      0,
      this.id,
      currentUser.user.userid,
      this.event ? this.event.files : this.uploadFiles,
      this.event ? this.event.id : null
    );
  }


  public saveInsightComment() {
    this.reply = false;
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._composeApi
        .postEvents$(this.id, this.submitEventObj)
        .subscribe(
          data => {
            this.replyFor = data.data.comment.id;
            data.data.comment.profile_pic = (data.data.user.user_profile !== undefined) ? data.data.user.user_profile.profile_pic : null;
            this.UpdateReplyId.emit({ 'newComment': data.data.comment, 'rid': data.data.comment.id });
            this._handleSubmitSuccess(data);
            this.canRemove = false;
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }

  public cancel() {
    this.reply = false;
    this.UpdateReplyId.emit({ 'rid': this.replyFor });
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this._toastr.success(res.message, 'Success');
    }
    else {
      this._toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this._toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }
  ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}
