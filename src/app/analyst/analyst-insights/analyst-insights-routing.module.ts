import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnPubllishInisghtsComponent } from './un-publlish-inisghts/un-publlish-inisghts.component';

const routes: Routes = [
  {
    path: 'my-insights', component: UnPubllishInisghtsComponent,
    data: {
      breadcrumb: 'My-Insights'
    },
  },
  { path: 'compose', loadChildren: 'app/analyst/analyst-insights/compose/compose.module#ComposeModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalystInsightsRoutingModule { }
