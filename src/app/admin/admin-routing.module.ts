import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalystsComponent } from './analysts/analysts.component';
import { ClientsComponent } from './clients/clients.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { UpdateClientComponent } from './clients/update-client/update-client.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CreatecountriesComponent } from './countries/createcountries/createcountries.component';
import { UpdatecountriesComponent } from './countries/updatecountries/updatecountries.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { StatesComponent } from './states/states.component';
import { StatesListComponent } from './states/states-list/states-list.component';
import { CreateStatesComponent } from './states/create-states/create-states.component';
import { UpdateStatesComponent } from './states/update-states/update-states.component';
import { AnalystsListComponent } from './analysts/analysts-list/analysts-list.component';
import { CreateAnalystComponent } from './analysts/create-analyst/create-analyst.component';
import { UpdateAnalystComponent } from './analysts/update-analyst/update-analyst.component';
import { PrivillegesComponent } from './clients/privilleges/privilleges.component';
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';

const AdminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '', component: AdminLayoutComponent,
    children: [
      
      { path: 'home', component: DashboardComponent },
      {
        path: 'clients', component: ClientsComponent,
        data: {
          breadcrumb: 'Clients'
        },
        children: [
          { path: '', component: ClientsListComponent },
          {
            path: 'create', component: CreateClientComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateClientComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
          {
            path: 'privilleges/:id', component: PrivillegesComponent,
            data: {
              breadcrumb: 'Privilleges'
            }
          },

        ]
      },

    
      {
        path: 'countries', component: ClientsComponent,
        data: {
          breadcrumb: 'Countries'
        },
        children: [
          { path: '', component: CountriesListComponent },
          {
            path: 'create', component: CreatecountriesComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdatecountriesComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'analysts', component: AnalystsComponent,
        data: {
          breadcrumb: 'Analysts'
        },
        children: [
          { path: '', component: AnalystsListComponent },
          {
            path: 'create', component: CreateAnalystComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateAnalystComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'countries', component: ClientsComponent,
        data: {
          breadcrumb: 'Countries'
        },
        children: [
          { path: '', component: CountriesListComponent },
          {
            path: 'create', component: CreatecountriesComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdatecountriesComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'states', component: StatesComponent,
        data: {
          breadcrumb: 'States'
        },
        children: [
          { path: '', component: StatesListComponent },
          {
            path: 'create', component: CreateStatesComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateStatesComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },

     
    
      {
        path: 'contact-us-list', component: ContactUsListComponent,
        data: {
          breadcrumb: 'ContactUslist'
        }
      },
      {
        path: 'management',
        data: {
          breadcrumb: 'Admins'
        }, loadChildren: 'app/admin/management/management.module#ManagementModule'
      },
      {
        path: 'editoriers',
        data: {
          breadcrumb: 'Editoriers'
        }, loadChildren: 'app/admin/editorier/editorier.module#EditorierModule'
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
