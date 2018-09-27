import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ScriptService } from '../services/script.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { StatesService } from '../services/states.service';
import { CountriesService } from '../services/countries.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserFormService } from '../services/users/user-form.service';
import { SignupComponent } from './signup/signup.component';
import { RepeatModule } from '../repeat/repeat.module';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    RepeatModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent, 
    ForgotPasswordComponent, 
    ResetPasswordComponent, 
    AuthLayoutComponent,
    LogoutComponent,
    UpdateProfileComponent,
    EditProfileComponent,
    SignupComponent
  ],
  providers: [
    ScriptService,
    UtilsService,
    DatePipe,
    UserFormService,
    UserService,
    StatesService,
    CountriesService,
  ]
})
export class AuthModule { }
