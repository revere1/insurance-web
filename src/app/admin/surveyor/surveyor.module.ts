import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyorRoutingModule } from './surveyor-routing.module';
import { CreateEditorierComponent } from './create-editorier/create-editorier.component';
import { EditoriersListComponent } from './editoriers-list/editoriers-list.component';
import { UpdateEditorierComponent } from './update-editorier/update-editorier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { RepeatModule } from '../../repeat/repeat.module';
import { EditorierFormComponent } from './editorier-form/editorier-form.component';

@NgModule({
  imports: [
    CommonModule,
    SurveyorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    RepeatModule,
  ],
  declarations: [CreateEditorierComponent, EditoriersListComponent, UpdateEditorierComponent, EditorierFormComponent]
})
export class SurveyorModule { }
