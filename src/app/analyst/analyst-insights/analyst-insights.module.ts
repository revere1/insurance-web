import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalystInsightsRoutingModule } from './analyst-insights-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { RepeatModule } from '../../repeat/repeat.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UnPubllishInisghtsComponent } from './un-publlish-inisghts/un-publlish-inisghts.component';
import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  imports: [
    CommonModule,
    AnalystInsightsRoutingModule,
    DataTablesModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule.forRoot()
  ],
  declarations: [UnPubllishInisghtsComponent]
})
export class AnalystInsightsModule { }
