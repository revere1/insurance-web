import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalystsComponent } from './analysts/analysts.component';
import { ClientsComponent } from './clients/clients.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { UpdateClientComponent } from './clients/update-client/update-client.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { TickersComponent } from './tickers/tickers.component';
import { TickersListComponent } from './tickers/tickers-list/tickers-list.component';
import { CreateTickerComponent } from './tickers/create-ticker/create-ticker.component';
import { UpdateTickerComponent } from './tickers/update-ticker/update-ticker.component';
import { CreatecountriesComponent } from './countries/createcountries/createcountries.component';
import { UpdatecountriesComponent } from './countries/updatecountries/updatecountries.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { StatesComponent } from './states/states.component';
import { StatesListComponent } from './states/states-list/states-list.component';
import { CreateStatesComponent } from './states/create-states/create-states.component';
import { UpdateStatesComponent } from './states/update-states/update-states.component';
import { SectorsComponent } from './sectors/sectors.component';
import { CreateSectorComponent } from './sectors/create-sector/create-sector.component';
import { UpdateSectorComponent } from './sectors/update-sector/update-sector.component';
import { SectorsListComponent } from './sectors/sectors-list/sectors-list.component';
import { SubSectorComponent } from './sub-sector/sub-sector.component';
import { CreateSubSectorComponent } from './sub-sector/create-sub-sector/create-sub-sector.component';
import { UpdateSubSectorComponent } from './sub-sector/update-sub-sector/update-sub-sector.component';
import { SubSectorListComponent } from './sub-sector/sub-sector-list/sub-sector-list.component';
import { AnalystsListComponent } from './analysts/analysts-list/analysts-list.component';
import { CreateAnalystComponent } from './analysts/create-analyst/create-analyst.component';
import { UpdateAnalystComponent } from './analysts/update-analyst/update-analyst.component';
import { RegionsComponent } from './regions/regions.component';
import { CurrencyComponent } from './currency/currency.component';
import { PrivillegesComponent } from './clients/privilleges/privilleges.component';
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';
import { AnalystCompaniesComponent } from './analyst-companies/analyst-companies.component';
import { AnalystCompaniesListComponent } from './analyst-companies/analyst-companies-list/analyst-companies-list.component';
import { CreateAnalystCompanyComponent } from './analyst-companies/create-analyst-company/create-analyst-company.component';
import { AnalystCompaniesUpdateComponent } from './analyst-companies/analyst-companies-update/analyst-companies-update.component';



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
        path: 'tickers', component: TickersComponent,
        data: {
          breadcrumb: 'Tickers'
        },
        children: [
          { path: '', component: TickersListComponent },
          {
            path: 'create', component: CreateTickerComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateTickerComponent,
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
        path: 'sectors', component: SectorsComponent,
        data: {
          breadcrumb: 'Sectors'
        },
        children: [
          { path: '', component: SectorsListComponent },
          {
            path: 'create', component: CreateSectorComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateSectorComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'sub-sector', component: SubSectorComponent,
        data: {
          breadcrumb: 'SubSector'
        },
        children: [
          { path: '', component: SubSectorListComponent },
          {
            path: 'create', component: CreateSubSectorComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateSubSectorComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'analyst-companies', component: AnalystCompaniesComponent,
        data: {
          breadcrumb: 'analyst-companies'
        },
        children: [
          { path: '', component: AnalystCompaniesListComponent },
          {
            path: 'create', component: CreateAnalystCompanyComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: AnalystCompaniesUpdateComponent,
            data: {
              breadcrumb: 'Update'
            }
          }
        ]
      },
      {
        path: 'regions', component: RegionsComponent,
        data: {
          breadcrumb: 'Regions'
        }
      },
      {
        path: 'contact-us-list', component: ContactUsListComponent,
        data: {
          breadcrumb: 'ContactUslist'
        }
      },

      {
        path: 'currency', component: CurrencyComponent,
        data: {
          breadcrumb: 'Currency'
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
      { path: 'insights', loadChildren: 'app/admin/admin-insights/admin-insights.module#AdminInsightsModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
