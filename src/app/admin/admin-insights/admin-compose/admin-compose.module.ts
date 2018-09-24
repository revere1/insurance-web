import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminComposeRoutingModule } from './admin-compose-routing.module';
import { AdminPreviewComponent } from './admin-preview/admin-preview.component';
import { CommodityService } from '../../../services/insights/commodity.service';
import { InsightService } from '../../../services/insights/insight.service';
import { RepeatModule } from '../../../repeat/repeat.module';
import { ComposeFormService } from '../../../services/compose/compose-form.service';

@NgModule({
  imports: [
    CommonModule,
    AdminComposeRoutingModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AdminPreviewComponent,
  ],
  providers: [
    CommodityService,
    InsightService,
    ComposeFormService
  ]
})
export class AdminComposeModule { }
