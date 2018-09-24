import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { RepeatModule } from '../repeat/repeat.module';
import { NotificationsComponent } from './notifications/notifications.component';
@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule
  ],
  declarations: [
    ChangePasswordComponent, 
    ProfileComponent, 
    EditProfileComponent, 
    NotificationsComponent
  ]
})
export class SettingsModule { }
