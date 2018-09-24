import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickTickerComponent } from './pick-ticker/pick-ticker.component';
import { SummaryComponent } from './summary/summary.component';
import { PreviewComponent } from './preview/preview.component';
import { ChooseTypeComponent } from '../choose-type/choose-type.component';

const routes: Routes = [
  { path: 'choose-type', component: ChooseTypeComponent },
  { path: 'choose-type/:id', component: ChooseTypeComponent },
  { path: 'pick-ticker/:type', component: PickTickerComponent },
  { path: 'pick-ticker/:type/:id', component: PickTickerComponent },
  { path: 'summary/:id', component: SummaryComponent },
  {
    path: 'preview/:id', component: PreviewComponent,
    data: {
      breadcrumb: 'Preview'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComposeRoutingModule { }
