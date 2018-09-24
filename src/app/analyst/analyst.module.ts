import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AnalystRoutingModule } from './analyst-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RepeatModule } from '../repeat/repeat.module';
import { ScriptService } from '../services/script.service';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { SectorFormService } from '../services/sectors/sector-form.service';
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
import { LockerFormService } from '../services/lockers/locker-form.service';
import { LockersService } from '../services/lockers.service';
import { ComposeService } from '../services/compose.service';
import { CommodityService } from '../services/insights/commodity.service';
import { NotificationService } from '../services/notifications.service';
import { InsightService } from '../services/insights/insight.service';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { MacroTypeService } from '../services/macrotype.service';
import { CompanyService } from '../services/company.service';
import { DashboardService } from '../services/dashboard.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { TopInsightsComponent } from './top-insights/top-insights.component';
import { LatestInsightsComponent } from './latest-insights/latest-insights.component';
import { UserFormService } from '../services/users/user-form.service';


@NgModule({
  imports: [
    CommonModule,
    AnalystRoutingModule,
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
    TopInsightsComponent,
    LatestInsightsComponent,
    
  ],
  providers: [
    ScriptService,
    UserService,
    UtilsService,
    DatePipe,
    UserFormService,
    MessagesFormService,
    SectorFormService,
    SectorsService,
    CompanyService,
    SubsectorsService,
    CountriesService,
    StatesService,
    HelpFormService,
    HelpService,
    MessagesService,
    LockerFormService,
    LockersService,
    ComposeService,
    CommodityService,
    NotificationService,
    InsightService,
    MacroTypeService,
    DashboardService,
    SafeHtmlPipe
  ]
})
export class AnalystModule { }
