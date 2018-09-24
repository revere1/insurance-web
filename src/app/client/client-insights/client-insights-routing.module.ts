import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  { path: 'compose', loadChildren: 'app/client/client-insights/client-compose/client-compose.module#ClientComposeModule' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientInsightsRoutingModule { }
