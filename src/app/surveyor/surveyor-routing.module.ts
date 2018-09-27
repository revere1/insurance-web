import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyorLayoutComponent } from './surveyor-layout/surveyor-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: SurveyorLayoutComponent,
    // children: [
    //   { path: 'insights', loadChildren: 'app/surveyor/surveyor-insights/surveyor-insights.module#SurveyorInsightsModule' },
    //   { path: 'home', component: DashboardComponent },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyorRoutingModule { }
