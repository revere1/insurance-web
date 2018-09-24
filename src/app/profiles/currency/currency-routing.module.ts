import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyLayoutComponent } from './currency-layout/currency-layout.component';
import { CurrencyInsightsComponent } from './currency-layout/currency-insights/currency-insights.component';

const routes: Routes = [
  {
    path: '', component: CurrencyLayoutComponent,
    children: [
      { path: '', component: CurrencyInsightsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
