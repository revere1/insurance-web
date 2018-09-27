import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: CustomerLayoutComponent,

    children: [
      { path: 'insights', loadChildren: 'app/customer/customer-insights/customer-insights.module#CustomerInsightsModule' },
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
export class CustomerRoutingModule { }
