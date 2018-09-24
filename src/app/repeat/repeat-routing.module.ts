import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { dynamicLayout } from '../services/user';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepeatRoutingModule {
  // constructor() {
  //   dynamicLayout()
  //   console.log('hi')
  // }
 }
