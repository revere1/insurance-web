import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScriptService } from '../services/script.service';
import { UtilsService } from '../services/utils.service';
import { CustomerRoutingModule } from './customer-routing.module';
import { RepeatModule } from '../repeat/repeat.module';
import { HelpFormService } from '../services/help/help-form.service';
import { HelpService } from '../services/help.service';
import { MessagesService } from '../services/messages.service';
import { MessagesFormService } from '../services/messages/messages-form.service';
import { UserService } from '../services/user.service';
import { SectorsService } from '../services/sectors.service';
import { SubsectorsService } from '../services/subsectors.service';
import { StatesService } from '../services/states.service';
import { CountriesService } from '../services/countries.service';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LockerFormService } from '../services/lockers/locker-form.service';
import { LockersService } from '../services/lockers.service';
import { CommodityService } from '../services/insights/commodity.service';
import { ComposeService } from '../services/compose.service';
import { InsightService } from '../services/insights/insight.service';
import { NotificationService } from '../services/notifications.service';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,

} from '@angular/material';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { UserFormService } from '../services/users/user-form.service';
@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    RepeatModule,
    FormsModule,
    DataTablesModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    ShareButtonsModule
  ],

  providers: [
    ScriptService,
    UtilsService,
    DatePipe,
    UserFormService,
    HelpFormService,
    MessagesFormService,
    UserService,
    HelpService,
    MessagesService,
    SectorsService,
    SubsectorsService,
    StatesService,
    CountriesService,
    LockerFormService,
    LockersService,
    CommodityService,
    ComposeService,
    InsightService,
    NotificationService
  ]
})


export class ClientModule { }


