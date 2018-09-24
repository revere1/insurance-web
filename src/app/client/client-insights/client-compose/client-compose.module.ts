import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientComposeRoutingModule } from './client-compose-routing.module';
import { ClientPreviewComponent } from './client-preview/client-preview.component';
import { ClientCommentsComponent } from './client-comments/client-comments.component';
import { ClientInsightCommentFormComponent } from './client-insight-comment-form/client-insight-comment-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { RepeatModule } from '../../../repeat/repeat.module';

@NgModule({
  imports: [
    CommonModule,
    ClientComposeRoutingModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule,
    DropzoneModule
  ],
  declarations: [ClientPreviewComponent, ClientCommentsComponent, ClientInsightCommentFormComponent]
})
export class ClientComposeModule { }
