import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorierPreviewComponent } from './editorier-preview/editorier-preview.component';
import { EditorierSummaryComponent } from './editorier-summary/editorier-summary.component';
import { UnpublishInsightsComponent } from './unpublish-insights/unpublish-insights.component';

const routes: Routes = [

  {
    path: 'my-insights', component: UnpublishInsightsComponent,
    data: {
      breadcrumb: 'my-insights'
    }
  },
  {path:'preview/:id',component:EditorierPreviewComponent,
  data: {
    breadcrumb: 'preview'
  },
},
  {path:'summary/:id', component:EditorierSummaryComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorierInsightsRoutingModule { }
