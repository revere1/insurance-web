
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LockersRoutingModule } from './lockers-routing.module';
import { LockerFormComponent } from './locker-form/locker-form.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { RepeatModule } from '../repeat/repeat.module';
import { MatchHeightModule } from '../shared/directives/match-height.directive';
@NgModule({
  imports: [
    CommonModule,
    RepeatModule,
    MatchHeightModule,
    FormsModule,
    ReactiveFormsModule,
    LockersRoutingModule,
    DropzoneModule
  ],
  declarations: [LockerFormComponent]
})
export class LockersModule { }
