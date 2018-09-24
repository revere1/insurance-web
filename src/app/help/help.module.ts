import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpRoutingModule } from './help-routing.module';
import { CreateHelpFormComponent } from '../help/create-help-form/create-help-form.component';
import { HelpListComponent } from './help-list/help-list.component';
import { RepeatModule } from '../repeat/repeat.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DataTablesModule } from 'angular-datatables';
import { HelpViewComponent } from './help-view/help-view.component';
import { HelpReplyFormComponent } from './help-reply-form/help-reply-form.component';

@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    DropzoneModule,
  ],
  declarations: [
    CreateHelpFormComponent,
    HelpListComponent,
    HelpViewComponent,
    HelpReplyFormComponent
  ],
  exports: [
  ]
})
export class HelpModule { }
