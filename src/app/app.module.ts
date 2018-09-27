import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { AuthService } from './services/auth.service';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { HttpModule } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from './repeat/repeat.module';
import { ContactUsFormService } from './services/contact_us/contact-us-form.service';
import { UserService } from './services/user.service';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { UtilsService } from './services/utils.service';
import { DatePipe } from '@angular/common';
import { ScriptService } from './services/script.service';
import { NotificationService } from './services/notifications.service';
import { MessagesService } from './services/messages.service';
import { HelpService } from './services/help.service';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { HelpFormService } from './services/help/help-form.service';
import {FileDropDirective,FileSelectDirective} from 'ng2-file-upload';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartsBuilderComponent } from './charts-builder/charts-builder.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { UserFormService } from './services/users/user-form.service';
import { CountriesService } from './services/countries.service';
import { StatesService } from './services/states.service';
import { MessagesFormService } from './services/messages/messages-form.service';
import { dynamicLayout} from './services/user';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    ContactUsComponent,
    ChartsBuilderComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'Vinod-Revere'}),
    NgxUIModule,
    NgxChartsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgProgressModule,   
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule    
  ],
  providers: [
    AuthGuard,
    RoleGuard, 
    AuthService, 
    ContactUsFormService, 
    UserService, 
    CountriesService,
    StatesService,
    UserFormService,
    UtilsService, 
    DatePipe, 
    ScriptService,
    NotificationService, 
    MessagesService, 
    HelpService, 
    HelpFormService,
    MessagesFormService,
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    FileDropDirective,
    FileSelectDirective,

  ],
  bootstrap: [AppComponent]
})



export class AppModule { 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
    dynamicLayout()
  }
}
