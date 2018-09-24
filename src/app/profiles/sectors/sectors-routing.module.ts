import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectorsLayoutComponent } from './sectors-layout/sectors-layout.component';
import { SectorsInsightsComponent } from './sectors-layout/sectors-insights/sectors-insights.component';

const routes: Routes = [
    {
    path: '', component:SectorsLayoutComponent ,
    children: [
      { path: '', component:SectorsInsightsComponent  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectorsRoutingModule { }
