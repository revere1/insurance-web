import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorierInsightsRoutingModule } from './editorier-insights-routing.module';
import { RepeatModule } from '../../repeat/repeat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { EditorierPreviewComponent } from './editorier-preview/editorier-preview.component';
import { EditorierSummaryComponent } from './editorier-summary/editorier-summary.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { UnpublishInsightsComponent } from './unpublish-insights/unpublish-insights.component';
import { EditorierCommentsComponent } from './editorier-comments/editorier-comments.component';
import { EditorierCommentFormComponent } from './editorier-comment-form/editorier-comment-form.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    EditorierInsightsRoutingModule,
    RepeatModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    DropzoneModule,
    ShareButtonsModule.forRoot(),
    NgxChartsModule
  ],
  declarations: [EditorierPreviewComponent, EditorierSummaryComponent, UnpublishInsightsComponent, EditorierCommentsComponent, EditorierCommentFormComponent]
})
export class EditorierInsightsModule { }
