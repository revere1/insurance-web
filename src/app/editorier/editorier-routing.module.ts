import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorierLayoutComponent } from './editorier-layout/editorier-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: EditorierLayoutComponent,
    children: [
      { path: 'insights', loadChildren: 'app/editorier/editorier-insights/editorier-insights.module#EditorierInsightsModule' },
      { path: 'home', component: DashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorierRoutingModule { }
