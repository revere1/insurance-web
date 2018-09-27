import { AdminLayoutComponent } from "../admin/admin-layout/admin-layout.component";
import { TpaLayoutComponent } from "../tpacompany/tpa-layout/tpa-layout.component";
import { CustomerLayoutComponent } from "../customer/customer-layout/customer-layout.component";
import { SurveyorLayoutComponent } from "../surveyor/surveyor-layout/surveyor-layout.component";
import { HomeComponent } from "../home/home.component";

export interface IUser {
    first_name: string;
    last_name?: string;
    email?: string;
    access_level: number;
    userid: number,
    registerdAt: string,
    profile_pic: string
}
export function dynamicLayout() {
    let component: any;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser.user.access_level === 1) {
            component = AdminLayoutComponent;
        }
        else if (currentUser.user.access_level === 2) {
            component = CustomerLayoutComponent;
        }
        else if (currentUser.user.access_level === 3) {
            component = TpaLayoutComponent;
        }
        else if (currentUser.user.access_level === 4) {
            component = SurveyorLayoutComponent;
        }
    } else {
        //return HomeComponent
    }
    return component;
}

