import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes = [
  {
    path: 'change-password', component: ChangePasswordComponent,
    data: {
      breadcrumb: 'Changepassword'
    }
  },
  {
    path: 'profile', component: ProfileComponent,
    data: {
      breadcrumb: 'Profile'
    }
  },
  {
    path: 'notifications', component: NotificationsComponent,
    data: {
      breadcrumb: 'Notifications'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
