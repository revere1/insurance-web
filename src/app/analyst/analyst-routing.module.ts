import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalystLayoutComponent } from './analyst-layout/analyst-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: AnalystLayoutComponent,
    children: [
     
      { path: 'home', component: DashboardComponent },
      { path: 'insights', loadChildren: 'app/analyst/analyst-insights/analyst-insights.module#AnalystInsightsModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalystRoutingModule { }
