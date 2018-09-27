import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { RoleGuard } from './_guards/role.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ChartsBuilderComponent } from './charts-builder/charts-builder.component';
import { dynamicLayout} from './services/user';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '', redirectTo: '/home',
        pathMatch: 'full'
      },
      { path: 'home', component: HomeComponent }
    ],
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { role: 1, breadcrumb: 'Home' },
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'customer',
    canActivate: [RoleGuard],
    data: { role: 2, breadcrumb: 'Home' },
    loadChildren: 'app/customer/customer.module#CustomerModule'
  },
  {
    path: 'tpa-company',
    canActivate: [RoleGuard],
    data: { role: 3, breadcrumb: 'Home' },
    loadChildren: 'app/tpacompany/tpacompany.module#TpaCompanyModule'
  },
  {
    path: 'surveyor',
    canActivate: [RoleGuard],
    data: { role: 4, breadcrumb: 'Home' },
    loadChildren: 'app/surveyor/surveyor.module#SurveyorModule'
  },
  {
    path: '',
    component:dynamicLayout(),
    children: [
      {
        path: 'messages',
        data: { breadcrumb: 'Messages' },
        loadChildren: 'app/messages/messages.module#MessagesModule'
      },
      {
        path: 'help',
        data: {
          breadcrumb: 'Help'
        },
        loadChildren: 'app/help/help.module#HelpModule'
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Settings' },
        loadChildren: 'app/settings/settings.module#SettingsModule'
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
  },
  { path: "contact-us", component: ContactUsComponent },
  { path: "charts-builder", component: ChartsBuilderComponent },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
