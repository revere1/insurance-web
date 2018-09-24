import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientPreviewComponent } from './client-preview/client-preview.component';


const routes: Routes = [

  {
    path: 'preview/:id', component: ClientPreviewComponent,
    data: {
      breadcrumb: 'Preview'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientComposeRoutingModule { }
