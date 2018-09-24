import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/basic.service';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from '../client/client-layout/client-layout.component';
import { AnalystLayoutComponent } from '../analyst/analyst-layout/analyst-layout.component';
import { EditorierLayoutComponent } from '../editorier/editorier-layout/editorier-layout.component';

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
            if (user.user.access_level === 1)  this.dynamicSideBar = '/assets/sidebar-menu.json';
            else if (user.user.access_level === 2)  this.dynamicSideBar = '/assets/client_sidebar.json';
            else if (user.user.access_level === 3)  this.dynamicSideBar = '/assets/analyst_sidebar.json';
            else if (user.user.access_level === 4)  this.dynamicSideBar = '/assets/editorier_sidebar.json';
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
                component = ClientLayoutComponent;
            }
            else if (user.user.access_level === 3) {
                component = AnalystLayoutComponent;
            }
            else if (user.user.access_level === 4) {
                component = EditorierLayoutComponent;
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