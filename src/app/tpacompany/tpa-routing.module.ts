import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TpaLayoutComponent } from './tpa-layout/tpa-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: TpaLayoutComponent,
    // children: [
     
    //   { path: 'home', component: DashboardComponent },
    //   { path: 'insights', loadChildren: 'app/tpa/tpa-insights/tpa-insights.module#TpaInsightsModule' }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpaRoutingModule { }
