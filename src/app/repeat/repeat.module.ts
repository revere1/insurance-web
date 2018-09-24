import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepeatRoutingModule } from './repeat-routing.module';
import { SubmittingComponent } from '../models/submitting.form';
import { LoadingComponent } from '../models/loading.component';
import { BreadcrumbComponent, BreadcrumbsService } from 'ng2-breadcrumbs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChooseTypeComponent } from '../analyst/analyst-insights/choose-type/choose-type.component';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { MatchHeightModule } from '../shared/directives/match-height.directive';
import { BarRatingModule } from "ngx-bar-rating";
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from '../client/client-layout/client-layout.component';
import { AnalystLayoutComponent } from '../analyst/analyst-layout/analyst-layout.component';
import { EditorierLayoutComponent } from '../editorier/editorier-layout/editorier-layout.component';
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
    ChooseTypeComponent,
    GlobalSearchComponent,
    SafeHtmlPipe,
    AdminLayoutComponent,
    SidebarComponent,
    MainLayoutComponent,
    ClientLayoutComponent,
    AnalystLayoutComponent,
    EditorierLayoutComponent,
  ],
  providers: [
    BreadcrumbsService,
  ],
  exports: [
    SubmittingComponent,
    LoadingComponent,
    BreadcrumbComponent,
    InfiniteScrollModule,
    ChooseTypeComponent,
    GlobalSearchComponent,
    SafeHtmlPipe,
    MatchHeightModule,
    BarRatingModule
  ]
})
export class RepeatModule {
}
