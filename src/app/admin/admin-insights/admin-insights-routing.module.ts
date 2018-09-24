import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommoditiesFormComponent } from './commodities-form/commodities-form.component';
import { UnpublishInsightsComponent } from './unpublish-insights/unpublish-insights.component';

const routes: Routes = [

  {
    path: 'my-insights', component: UnpublishInsightsComponent,
    data: {
      breadcrumb: 'my-insights'
    },
  },
  {
    path: 'commodities', component: CommoditiesFormComponent,
    data: {
      breadcrumb: 'Note Types'
    },
  },
  { path: 'compose', loadChildren: 'app/admin/admin-insights/admin-compose/admin-compose.module#AdminComposeModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInsightsRoutingModule { }
