import { Component, OnInit, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HelpFormService } from './../../services/help/help-form.service';
import { HelpCommentModel, FormHelpCommentModel } from './../../models/helpcomment.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpService } from './../../services/help.service';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
declare var $: any;
@Component({
  selector: 'app-help-reply-form',
  templateUrl: './help-reply-form.component.html',
  styleUrls: ['./help-reply-form.component.css']
})
export class HelpReplyFormComponent implements OnInit {

  @Input() event: HelpCommentModel;
  public isEdit: boolean;
  public showform: boolean = false;
  helpcommentForm: FormGroup;
  public apiEvents = [];
  routeSub: Subscription;
  private id: number;
  private createdBy: number;
  public problemsData: any;
  // Model storing initial form values
  public formEvent: FormHelpCommentModel;
  // Form validation and disabled logic
  public formErrors: any;
  public formChangeSub: Subscription;
  public msgTo: number;
  // Form submission
  public submitEventObj: HelpCommentModel;
  public submitting: boolean;
  submitEventSub: Subscription;
  public error: boolean;
  public submitBtnText: string;
  public reply: boolean;
  public canRemove: boolean = true;
  public currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public role: any;
  @Input() replyFor: any;
  @Input() prbRow: any;
  @Output() UpdateReplyId: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _helpapi: HelpService,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    public cf: HelpFormService,
    private _auth: AuthService,
    public utils: UtilsService,
    private _userapi: UserService,
  ) {
    this.helpcommentForm = new FormGroup({
      description: new FormControl(),
      status: new FormControl()
    });
    _auth.loadSession();
  }

  ngOnInit() {

    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];

      });
      if (!this.currentUser) {
      }
      else {
        this._userapi.getRoleByAccess$(this.currentUser.user.access_level).subscribe(data => {
          if (data.success === false) {
          } else {
            this.role = data.data.name;
          }
        });
      }
//get  help based Help Id
    this._helpapi.getHelpById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsData = data.data;
      }
    });

    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';

    $(document).ready(() => {
      $('#description').summernote();
    });

  }

  ngOnChanges() {
    if (this.replyFor) {
      //get the comment row
      this._helpapi.getComment$(this.replyFor).subscribe(data => {
        if (data.success) {
          let curUser = this._helpapi.getUserId();
          this.msgTo = (curUser !== data.data.msgTo) ? data.data.msgTo : data.data.createdBy;
          this.loadInits();
        }
        else {
          this.msgTo = this.prbRow.createdBy;
          this.loadInits();
        }
      });
    }
    else {
      this.msgTo = this.prbRow.createdBy;
      this.loadInits();
    }

  }

  //load buildform and set events
  loadInits() {
    this.formEvent = this._setFormEvent();
    this._buildForm();
  }

  private _buildForm() {
    let validRules = {
      description: [this.formEvent.message, [
      ]],
      status: [this.formEvent.status, [
      ]]
    };

    this.helpcommentForm = this.fb.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.helpcommentForm
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
      _markDirty(this.helpcommentForm);
    }
    this._onValueChanged();
  }

  //set helpform event
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormHelpCommentModel(null,this.problemsData[0].status, null, null, null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormHelpCommentModel(
        this.event.message,
        this.event.status,
        this.event.parentId,
        this.event.is_read,
        this.event.problemId,
        this.event.msgTo,
        this.event.createdBy,
        this.event.resolvedBy,
        this.event.resolved_date
      );
    }
  }


  private _onValueChanged() {
    if (!this.helpcommentForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.helpcommentForm.get(field), this.formErrors, field);
      }
    }
  }


  //set error messages for validations
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

  //reset help form
  resetForm() {
    this.helpcommentForm.reset();
    $("#description").summernote("reset")
  }

  //get subnit object
  private _getSubmitObj() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new HelpCommentModel(
      $('#description').summernote('code'),
      this.helpcommentForm.get('status').value,
      this.replyFor,
      0,
      this.problemsData[0].pid,
      (this.problemsData[0].createdBy == currentUser.user.userid) ? this.problemsData[0].msgTo : this.problemsData[0].createdBy,
      this.event ? this.event.createdBy : currentUser.user.userid,
      (this.helpcommentForm.get('status').value === 'Resolved') ? currentUser.user.userid : null,
      (this.helpcommentForm.get('status').value === 'Resolved') ? null : null,
      this.event ? this.event.id : null
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    this.showform = false;
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


  //submit an Object to service
  saveHelpComment(problemId) {
    $('#helpitem' + problemId).remove();
    $("#rehelpcounthead,#rehelpcount").text(function (v, n) {
      if (JSON.parse(n) != 0) {
        return JSON.parse(n) - 1;
      } else {
        return 0;
      }
    });
    if ($('#description').summernote('isEmpty')) {
      this.formErrors['description'] = this.cf.validationMessages['description'].required;
      this._setErrMsgs(this.helpcommentForm.get('description'), this.formErrors, 'description');
      return false;
    }
    else {
      this.formErrors['description'] = '';
      this._setErrMsgs(this.helpcommentForm.get('description'), this.formErrors, 'description');
    }

    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._helpapi
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

  cancel() {
    this.reply = false;
    this.router.navigate(['/help']);
  }

  //destory all the api services
  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}
