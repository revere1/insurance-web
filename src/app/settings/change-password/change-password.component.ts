import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  private token: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _authApi: AuthService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _toastr: ToastsManager) {
    _authApi.loadSession();
  }

  public ChangePwdForm: FormGroup = this._formBuilder.group({
    password: [null, 
      Validators.required],
    confirm_password: [null, Validators.required]
  }, { validator: this._checkPasswords });

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
  }

  private _checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.password,
      confirmPass = group.controls.confirm_password;
    return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  }

  public changePwd(formdata: any): void {
    this.ChangePwdForm.value['token'] = this.token;
    if (this.ChangePwdForm.dirty && this.ChangePwdForm.valid) {
      this._authApi.changePassword(this.ChangePwdForm.value)
        .subscribe(data => {
          if (data.success === false) {
            this._toastr.error(data.message, 'Invalid');
          } else {
            this._toastr.success(data.message, 'Success');
            this._router.navigate(['/auth/login']);
          }
          this.ChangePwdForm.reset();
        });
    }
  }

}
