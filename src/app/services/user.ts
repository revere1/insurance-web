import { AdminLayoutComponent } from "../admin/admin-layout/admin-layout.component";
import { AnalystLayoutComponent } from "../analyst/analyst-layout/analyst-layout.component";
import { ClientLayoutComponent } from "../client/client-layout/client-layout.component";
import { EditorierLayoutComponent } from "../editorier/editorier-layout/editorier-layout.component";
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
            component = ClientLayoutComponent;
        }
        else if (currentUser.user.access_level === 3) {
            component = AnalystLayoutComponent;
        }
        else if (currentUser.user.access_level === 4) {
            component = EditorierLayoutComponent;
        }
    } else {
        //return HomeComponent
    }
    return component;
}

