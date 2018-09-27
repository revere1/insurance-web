import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepeatRoutingModule } from './repeat-routing.module';
import { SubmittingComponent } from '../models/submitting.form';
import { LoadingComponent } from '../models/loading.component';
import { BreadcrumbComponent, BreadcrumbsService } from 'ng2-breadcrumbs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { MatchHeightModule } from '../shared/directives/match-height.directive';
import { BarRatingModule } from "ngx-bar-rating";
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from '../customer/customer-layout/customer-layout.component';
import { TpaLayoutComponent } from '../tpacompany/tpa-layout/tpa-layout.component';
import { SurveyorLayoutComponent } from '../surveyor/surveyor-layout/surveyor-layout.component';
import { dynamicLayout } from '../services/user';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { BaseService } from '../services/basic.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RepeatRoutingModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatchHeightModule,
    BarRatingModule
  ],
  declarations: [
    SubmittingComponent,
    LoadingComponent,
    BreadcrumbComponent,
    GlobalSearchComponent,
    SafeHtmlPipe,
    AdminLayoutComponent,
    SidebarComponent,
    MainLayoutComponent,
    CustomerLayoutComponent,
    TpaLayoutComponent,
    SurveyorLayoutComponent,
  ],
  providers: [
    BreadcrumbsService,
  ],
  exports: [
    SubmittingComponent,
    LoadingComponent,
    BreadcrumbComponent,
    InfiniteScrollModule,
     GlobalSearchComponent,
    SafeHtmlPipe,
    MatchHeightModule,
    BarRatingModule
  ]
})
export class RepeatModule {
}
