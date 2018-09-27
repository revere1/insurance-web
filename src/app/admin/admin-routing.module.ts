import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TpacompaniesComponent } from './tpacompanies/tpacompanies.component';
import { CustomersComponent } from './customers/customers.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { UpdateCustomerComponent } from './customers/update-customer/update-customer.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CreatecountriesComponent } from './countries/createcountries/createcountries.component';
import { UpdatecountriesComponent } from './countries/updatecountries/updatecountries.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { StatesComponent } from './states/states.component';
import { StatesListComponent } from './states/states-list/states-list.component';
import { CreateStatesComponent } from './states/create-states/create-states.component';
import { UpdateStatesComponent } from './states/update-states/update-states.component';
import { TpacompaniesListComponent } from './tpacompanies/tpacompanies-list/tpacompanies-list.component';
import { CreateTpacompaniesComponent } from './tpacompanies/create-tpacompanies/create-tpacompanies.component';
import { UpdateTpacompaniesComponent } from './tpacompanies/update-tpacompanies/update-tpacompanies.component';
import { PrivillegesComponent } from './customers/privilleges/privilleges.component';
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
        path: 'clients', component: CustomersComponent,
        data: {
          breadcrumb: 'Clients'
        },
        children: [
          { path: '', component: CustomersListComponent },
          {
            path: 'create', component: CreateCustomerComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateCustomerComponent,
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
        path: 'countries', component: CustomersComponent,
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
        path: 'analysts', component: TpacompaniesComponent,
        data: {
          breadcrumb: 'Analysts'
        },
        children: [
          { path: '', component: TpacompaniesListComponent },
          {
            path: 'create', component: CreateTpacompaniesComponent,
            data: {
              breadcrumb: 'Create'
            }
          },
          {
            path: 'update/:id', component: UpdateTpacompaniesComponent,
            data: {
              breadcrumb: 'Update'
            }
          },
        ]
      },
      {
        path: 'countries', component: CustomersComponent,
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
        path: 'surveyor',
        data: {
          breadcrumb: 'Editoriers'
        }, loadChildren: 'app/admin/surveyor/surveyor.module#SurveyorModule'
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
