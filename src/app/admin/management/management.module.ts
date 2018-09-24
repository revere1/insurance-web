import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementRoutingModule } from './management-routing.module';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { DataTablesModule } from 'angular-datatables';
import { AdminsListComponent } from './admins-list/admins-list.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { UpdateAdminComponent } from './update-admin/update-admin.component';
import { RepeatModule } from '../../repeat/repeat.module';


@NgModule({
  imports: [
    CommonModule,
    ManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    RepeatModule
  ],
  declarations: [
    AdminsListComponent,
    AdminFormComponent,
    CreateAdminComponent,
    UpdateAdminComponent,
  ],
  providers: [
    UserService
  ]
})
export class ManagementModule { }
