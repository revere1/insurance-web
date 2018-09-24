import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageFormListComponent } from './message-form-list/message-form-list.component';
import { MessageCreateFormComponent } from './message-create-form/message-create-form.component';

const routes: Routes = [
  {
    path: 'read',
    redirectTo: 'read/',
    pathMatch: 'full'
  },
  { path: '', component: MessageFormListComponent },
  {
    path: 'read/:id', component: MessageFormListComponent,
    data: {
      breadcrumb: 'Read'
    }
  },
  {
    path: 'create', component: MessageCreateFormComponent,
    data: {
      breadcrumb: 'Create'
    }
  },
  {
    path: 'create/:id', component: MessageCreateFormComponent,
    data: {
      breadcrumb: 'Create'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
