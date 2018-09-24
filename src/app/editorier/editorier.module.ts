import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EditorierRoutingModule } from './editorier-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RepeatModule } from '../repeat/repeat.module';
import { ScriptService } from '../services/script.service';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { SectorsService } from '../services/sectors.service';
import { SubsectorsService } from '../services/subsectors.service';
import { CountriesService } from '../services/countries.service';
import { StatesService } from '../services/states.service';
import { MessagesService } from '../services/messages.service';
import { HelpFormService } from '../services/help/help-form.service';
import { HelpService } from '../services/help.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesFormService } from '../services/messages/messages-form.service';
import { DataTablesModule } from 'angular-datatables';
import { ComposeService } from '../services/compose.service';
import { CommodityService } from '../services/insights/commodity.service';
import { InsightService } from '../services/insights/insight.service';
import { ComposeFormService } from '../services/compose/compose-form.service';
import { NotificationService } from '../services/notifications.service';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { DashboardService } from '../services/dashboard.service';
import { UserFormService } from '../services/users/user-form.service';
@NgModule({
  imports: [
    CommonModule,
    EditorierRoutingModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    ScriptService,
    UtilsService,
    DatePipe,
    UserService,
    HelpService,
    MessagesService,
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
    CommodityService,
    ComposeService,
    InsightService,
    ComposeFormService,
    NotificationService,
    DashboardService
  ]
})
export class EditorierModule { }
