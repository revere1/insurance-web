import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LockerFormComponent } from './locker-form/locker-form.component';

const LockerRoutes: Routes = [
  {
    path: '', data: { breadcrumb: 'lockers' },
    component: LockerFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(LockerRoutes)],
  exports: [RouterModule]
})
export class LockersRoutingModule { }
