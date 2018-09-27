import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TpacompaniesComponent } from './tpacompanies/tpacompanies.component';
import { CustomersComponent } from './customers/customers.component';
import { ScriptService } from './../services/script.service';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { UpdateCustomerComponent } from './customers/update-customer/update-customer.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { UserService } from '../services/user.service';
import { CountriesService } from '../services/countries.service';
import { StatesService } from '../services/states.service';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { UtilsService } from '../services/utils.service';
import { DataTablesModule } from 'angular-datatables';
import { StatesComponent } from './states/states.component';
import { StatesFormComponent } from './states/states-form/states-form.component';
import { StatesListComponent } from './states/states-list/states-list.component';
import { CreateStatesComponent } from './states/create-states/create-states.component';
import { UpdateStatesComponent } from './states/update-states/update-states.component';
import { CountriesComponent } from './countries/countries.component';
import { CreatecountriesComponent } from './countries/createcountries/createcountries.component';
import { UpdatecountriesComponent } from './countries/updatecountries/updatecountries.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { CountriesFormComponent } from './countries/countries-form/countries-form.component';
import { CountriesFormService } from '../services/countries/countries-form.service';
import { StatesFormService } from '../services/states/states-form.service';
import { TpacompaniesFormComponent } from './tpacompanies/tpacompanies-form/tpacompanies-form.component';
import { TpacompaniesListComponent } from './tpacompanies/tpacompanies-list/tpacompanies-list.component';
import { CreateTpacompaniesComponent } from './tpacompanies/create-tpacompanies/create-tpacompanies.component';
import { UpdateTpacompaniesComponent } from './tpacompanies/update-tpacompanies/update-tpacompanies.component';
import { DashboardService } from '../services/dashboard.service';
import { RepeatModule } from '../repeat/repeat.module';
import { HelpFormService } from '../services/help/help-form.service';
import { HelpService } from '../services/help.service';
import { MessagesService } from '../services/messages.service';
import { MessagesFormService } from '../services/messages/messages-form.service';
import { NotificationService } from '../services/notifications.service';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,

} from '@angular/material';
import { PrivillegesComponent } from './customers/privilleges/privilleges.component';
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';
import { UserFormService } from '../services/users/user-form.service';
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    RepeatModule,
    NgxChartsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [
    DashboardComponent,
    TpacompaniesComponent,
    CustomersComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent,
    CustomersListComponent,
    CustomerFormComponent,
    StatesComponent,
    StatesFormComponent,
    StatesListComponent,
    CreateStatesComponent,
    UpdateStatesComponent,
    CountriesComponent,
    CountriesListComponent,
    CreatecountriesComponent,
    UpdatecountriesComponent,
    CountriesFormComponent,
    TpacompaniesFormComponent,
    TpacompaniesListComponent,
    CreateTpacompaniesComponent,
    UpdateTpacompaniesComponent,
    PrivillegesComponent,
    ContactUsListComponent,
  
  ],
  providers: [
    ScriptService,
    UserFormService,
    UserService,
    CountriesService,
    StatesService,
    UtilsService,
    DatePipe,
    CountriesFormService,
    StatesFormService,
    DashboardService,
    HelpFormService,
    HelpService,
    MessagesService,
    MessagesFormService,
    NotificationService,
  ]

})
export class AdminModule { }
