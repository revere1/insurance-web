import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { MessagesModel, MessagesFormModel } from '../../models/messages.model';
import { ENV } from '../../env.config';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
import { MessagesFormService } from '../../services/messages/messages-form.service';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-message-create-form',
  templateUrl: './message-create-form.component.html',
  styleUrls: ['./message-create-form.component.css']
})
export class MessageCreateFormComponent implements OnInit {

  @Input() event: MessagesModel;
  private isEdit: boolean;
  private apiEvents = [];
  // Model storing initial form values
  private formEvent: MessagesFormModel;
  private formChangeSub: Subscription;
  private routeSub: any;
  private tryingToPaste = false;
  // Form submission
  private submitEventObj: MessagesModel;
  private submitEventSub: Subscription;
  private uploadFilesObj = {};
  private uploadFiles = [];
  public error: boolean;
  public submitBtnText: string;
  public user: any;
  public id: any;
  public canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};
  public tickerInd = ENV['$'];
  public analystInd = ENV['@'];
  public InsightInd = ENV['#'];
  public totalsize: number = 0.0;
  public messageForm: FormGroup;
  // Form validation and disabled logic
  public formErrors: any;
  public submitting: boolean;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _userApi: UserService,
    private _messageFormService: MessagesFormService,
    private _messagesApi: MessagesService,
    public toastr: ToastsManager,
    private _auth : AuthService,
  ) { 
    _auth.loadSession();
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
    this.id = this._messagesApi.getCurUserId();
    this.formErrors = this._messageFormService.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    let _that = this;
    $(document).ready(() => {
      $('#message').summernote({
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
              _that._uploadFile(files, this);
          },
        },
        //hint: that._utils.hint()
      });
      let select2Obj = $("#sent_to").select2({
        minimumInputLength: 2,
        ajax: {
          url: ENV.BASE_API + "auto-search-users?token=" + that._messagesApi.getToken(),
          dataType: 'json',
          data: function (params) {
            return {
              p: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            var data = $.map(data, function (obj) {
              obj.id = obj.id;
              obj.text = obj.sku;
              return obj;
            });
            params.page = params.page || 1;
            return {
              results: data,
              pagination: {
                more: (params.page * 30) < data.total_count
              }
            };
          },
          cache: true
        },
        escapeMarkup: function (markup) {
          return markup;
        }, // let our custom formatter work
      });
      select2Obj.on("select2:select", function (e) {
        that.messageForm.patchValue({ 'id': e.params.data.id });
      });
    });
    this.routeSub = this._route.params
      .subscribe(params => {
        this.id = params['id'];
      });
    this._userApi.getUserById$(this.id).subscribe(data => {
      if (data.success === false) {
        this._router.navigate(['/messages/create'])
      }
      else {
        this.user = data.data;
        $("#sent_to").empty().append(`<option value="${this.user.id}">${this.user.first_name} ${this.user.last_name}</option>`).val(`${this.user.id}`).trigger('change');
        this.messageForm.patchValue({ 'id': this.user.id });
      }
    });
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'messages/path/?token=' + this._messagesApi.getToken(),
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
                that._setErrMsgs(that.messageForm.get('files'), that.formErrors, 'files');
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

  private _uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._messagesApi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }

  private removeFile(file) {
    let apiEvent = this._messagesApi.removeFile(file).subscribe(
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

      Object.assign(this.uploadFilesObj, {[eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.messageForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.messageForm.get('files'), this.formErrors, 'files');
  }

  private _buildForm() {
    let validRules = {
      sent_to: [this.formEvent.sent_to, [
      ]],
      subject: [this.formEvent.subject, [
        Validators.required
      ]],
      message: [this.formEvent.message, [
      ]],
    };
    this.messageForm = this._fb.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.messageForm
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
      _markDirty(this.messageForm);
    }
    this._onValueChanged();
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new MessagesFormModel(null, null, null, null, null, []);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new MessagesFormModel(
        this.event.sent_to,
        this.event.subject,
        this.event.message,
        this.event.sent_from,
        this.event.parent,
        this.event.files,
      );
    }
  }

  private _onValueChanged() {
    if (!this.messageForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.messageForm.get(field), this.formErrors, field);
      }
    }
  }

 private _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this._messageFormService.validationMessages[field];
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
    return new MessagesModel(
      $('#sent_to').select2('data')[0].id,
      this.messageForm.get('subject').value,
      $('#message').summernote('code'),
      currentUser.user.userid,
      null,
      this.event ? this.event.files : this.uploadFiles,
    );
  }

  public createMessages() {
    if ($('#sent_to').select2('data').length <= 0) {
      this.formErrors['sent_to'] = this._messageFormService.validationMessages['sent_to'].required;
      this._setErrMsgs(this.messageForm.get('sent_to'), this.formErrors, 'sent_to');
      return false;
    }
    else {
      this.formErrors['sent_to'] = '';
      this._setErrMsgs(this.messageForm.get('sent_to'), this.formErrors, 'sent_to');
    }
    if ($('#message').summernote('isEmpty')) {
      this.formErrors['message'] = this._messageFormService.validationMessages['message'].required;
      this._setErrMsgs(this.messageForm.get('message'), this.formErrors, 'message');
      return false;
    }
    else {
      this.formErrors['message'] = '';
      this._setErrMsgs(this.messageForm.get('message'), this.formErrors, 'message');
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._messagesApi
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => {
            this._handleSubmitSuccess(data);
            this.canRemove = false;
            this._router.navigate(['/messages/read/'])
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  
  public resetForm() {
    this.messageForm.reset();
    //addRemoveLinks: true,
    $("#sent_to").select2("val", "");
    $("#message").summernote("reset");
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

  private ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}

