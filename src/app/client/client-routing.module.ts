import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientLayoutComponent } from './client-layout/client-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: ClientLayoutComponent,

    children: [
      { path: 'insights', loadChildren: 'app/client/client-insights/client-insights.module#ClientInsightsModule' },
      {
        path: 'home',
        children: [
          { path: '', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
