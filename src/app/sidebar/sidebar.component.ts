import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/basic.service';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from '../customer/customer-layout/customer-layout.component';
import { TpaLayoutComponent } from '../tpacompany/tpa-layout/tpa-layout.component';
import { SurveyorLayoutComponent } from '../surveyor/surveyor-layout/surveyor-layout.component';

declare var $:any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [BaseService]
})
export class SidebarComponent implements OnInit {
    isActive = false;
    showMenu = '';
    sideBarMenu = [];
    dynamicSideBar : any;
    constructor( private baseService: BaseService) { }
    ngOnInit() {
        $(document).ready(() => {
            const trees: any = $('[data-widget="tree"]');
            trees.tree();
          });
        this.initData();
        this.initLayout();
    }
    initData() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            if (user.user.access_level === 1)  this.dynamicSideBar = '/assets/admin-menu.json';
            else if (user.user.access_level === 2)  this.dynamicSideBar = '/assets/customer_sidebar.json';
            else if (user.user.access_level === 3)  this.dynamicSideBar = '/assets/garage_sidebar.json';
            else if (user.user.access_level === 4)  this.dynamicSideBar = '/assets/surveyor_sidebar.json';
        } else {
            this.dynamicSideBar = '/assets/sidebar.json'
        }   
        this.baseService.getData(this.dynamicSideBar).then(
          (data) => {
              this.sideBarMenu = data;
          }
      );
    }

    initLayout(){
        let component: any;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            if (user.user.access_level === 1) {
                component = AdminLayoutComponent;
            }
            else if (user.user.access_level === 2) {
                component = CustomerLayoutComponent;
            }
            else if (user.user.access_level === 3) {
                component = TpaLayoutComponent;
            }
            else if (user.user.access_level === 4) {
                component = SurveyorLayoutComponent;
            }
        } else {
            //return HomeComponent
        }
        return component;
    }
    
   
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}