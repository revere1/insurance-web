import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../../services/user.service';
import { UtilsService } from './../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ENV } from './../../env.config';
import { RequestOptions } from '@angular/http';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { IUser } from '../../services/user';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private filesToUpload: Array<File>;
  private id: number;
  private userSub: Subscription;
  private serverURL = ENV.SERVER_URL;
  private avatar: string = null;
  public edit: boolean;
  public loading: boolean;
  public userprofile: UserModel;
  public dynamicImg: string = 'assets/img/avatar5.png';


  @ViewChild('fileInput') fileInput;

  constructor(
    private http: HttpClient,
    private _userapi: UserService,
    private _auth: AuthService,
    public utils: UtilsService,
    public toastr: ToastsManager) {
    _auth.loadSession();
    this.filesToUpload = [];
  }

  ngOnInit() {
    this.edit = false;
    this.id = this._userapi.getCurUserId();
    this._getUser();
    this._getAvatar();
  }

  private _getAvatar() {
    let id = this._userapi.getCurUserId();
    this._userapi.getUserById$(id).subscribe((data) => {
      this.dynamicImg = ((data.data.profile_pic != undefined) && (data.data.profile_pic.length))
        ? ENV.SERVER_URL + data.data.profile_pic
        : this.dynamicImg;
    });
  }

  public updateProfile() {
    this.edit = true;
  }

  public cancel() {
    this.edit = false;
  }

  public fileChangeEvent() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("profile_pic", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      formData.append("id", String(this.id));
      this._userapi.upload(formData).subscribe(res => {
        if (res.success) {
          this.utils.updateUserSession(res.data);
          this.dynamicImg = ENV.SERVER_URL + res.data.profile_pic;
          let that = this;
          $('.user-image,.img-circle').each(function () {
            $(this).attr('src', that.dynamicImg)
          });
          this.toastr.success(res.message, 'Success');
        }
        else {
          this.toastr.error(res.message, 'Error');
        }
      });
    }
  }

  public close() {
    this.edit = false;
  }

  public onEdit(): void {
    this._getUser();
    this.edit = false;
  }

  private _getUser() {
    this.loading = true;
    // GET event by ID
    this.userSub = this._userapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          if (res.success) {
            this.userprofile = res.data;
            this.avatar = this.serverURL + this.userprofile.profile_pic;
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
  }

}
