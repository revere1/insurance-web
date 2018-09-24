import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComposeRoutingModule } from './compose-routing.module';
// import { ChooseTypeComponent } from './choose-type/choose-type.component';
import { PickTickerComponent } from './pick-ticker/pick-ticker.component';
import { CommodityService } from '../../../services/insights/commodity.service';
import { InsightService } from '../../../services/insights/insight.service';
import { SummaryComponent } from './summary/summary.component';
import { DataTablesModule } from 'angular-datatables/src/angular-datatables.module';
import { RepeatModule } from '../../../repeat/repeat.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ComposeFormService } from '../../../services/compose/compose-form.service';
import { PreviewComponent } from './preview/preview.component';
import { SectorsService } from '../../../services/sectors.service';
import { SubsectorsService } from '../../../services/subsectors.service';
import { BaseService } from '../../../services/basic.service';
import { MacroTypeFormService } from '../../../services/pick_macro_type/macro-type-form-service';
import { AnalystInsightCommentsComponent } from './analyst-insight-comments/analyst-insight-comments.component';
import { AnalystCommentsComponent } from './analyst-comments/analyst-comments.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    ComposeRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    RepeatModule,
    DropzoneModule,
    NgxChartsModule
  ],
  declarations: [
     PickTickerComponent,
     SummaryComponent,
     PreviewComponent,
     AnalystInsightCommentsComponent,
     AnalystCommentsComponent,
     //SafeHtmlPipe
    ],
  providers:[
    CommodityService,
    InsightService,
    ComposeFormService,
    SectorsService,
    SubsectorsService,
    BaseService,
    MacroTypeFormService
    
  ]
})
export class ComposeModule { }
