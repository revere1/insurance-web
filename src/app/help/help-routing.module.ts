import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateHelpFormComponent } from '../help/create-help-form/create-help-form.component';
import { HelpListComponent } from './help-list/help-list.component';
import { HelpViewComponent } from './help-view/help-view.component';

const routes: Routes = [
  
  {
    path: '', component: HelpListComponent,
  },
  {
    path: 'create', component: CreateHelpFormComponent,
    data: {
      breadcrumb: 'Create'
    }
  },

  {
    path: 'read/:id', component: HelpViewComponent,
    data: {
      breadcrumb: 'Read'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
