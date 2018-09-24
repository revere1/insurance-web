import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPreviewComponent } from './admin-preview/admin-preview.component';

const routes: Routes = [
  {
    path: 'preview/:id', component: AdminPreviewComponent,
    data: {
      breadcrumb: 'Preview'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminComposeRoutingModule { }
