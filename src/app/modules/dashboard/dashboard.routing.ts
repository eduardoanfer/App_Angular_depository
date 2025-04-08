import { Routes } from "@angular/router";
import { DashboardHomeComponent } from "./page/dashboard-home/dashboard-home.component";

export const DASHBOARD_ROUTES : Routes = [
  {
    path: '', // estamos indo direto para um path vazio 
    component: DashboardHomeComponent
//recebendo o componente DashboardHomeComponent 
  },

];