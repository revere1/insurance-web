import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientInsightsRoutingModule } from './client-insights-routing.module';
import { RepeatModule } from '../../repeat/repeat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
  imports: [
    CommonModule,
    ClientInsightsRoutingModule,
    RepeatModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ShareButtonsModule.forRoot()
  ],
  declarations: [
  ],
  providers: [
  ]

})
export class ClientInsightsModule { }
