import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TpaCompanyRoutingModule } from './tpaCompany-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RepeatModule } from '../repeat/repeat.module';
import { ScriptService } from '../services/script.service';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { CountriesService } from '../services/countries.service';
import { StatesService } from '../services/states.service';
import { MessagesService } from '../services/messages.service';
import { HelpFormService } from '../services/help/help-form.service';
import { HelpService } from '../services/help.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesFormService } from '../services/messages/messages-form.service';
import { DataTablesModule } from 'angular-datatables';
import { NotificationService } from '../services/notifications.service';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { DashboardService } from '../services/dashboard.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { UserFormService } from '../services/users/user-form.service';


@NgModule({
  imports: [
    CommonModule,
    TpaCompanyRoutingModule,
    ReactiveFormsModule,
    RepeatModule,
    FormsModule,
    DataTablesModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    ShareButtonsModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    ScriptService,
    UserService,
    UtilsService,
    DatePipe,
    UserFormService,
    MessagesFormService,
    CountriesService,
    StatesService,
    HelpFormService,
    HelpService,
    MessagesService,
    NotificationService,
    DashboardService,
    SafeHtmlPipe
  ]
})
export class TpaCompanyModule { }
