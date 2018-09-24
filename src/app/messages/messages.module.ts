import { NgModule} from '@angular/core';
import { CommonModule} from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessageFormListComponent } from './message-form-list/message-form-list.component';
import { MessageCreateFormComponent } from './message-create-form/message-create-form.component';
import { MessageReplyFormComponent } from './message-reply-form/message-reply-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DataTablesModule } from 'angular-datatables';
import { RepeatModule } from '../repeat/repeat.module';
@NgModule({
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    RepeatModule,
    DropzoneModule
  ],
  declarations: [MessageFormListComponent, MessageCreateFormComponent, MessageReplyFormComponent]
})
export class MessagesModule {}

