import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from 'src/app/shared/shared.module'; // importando o módulo compartilhado

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES) ,// importando as rotas do dashboard.routing.ts
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule,
    // importando o módulo compartilhado,
    SharedModule
  ],
  providers: [MessageService,CookieService],
})
export class DashboardModule { }
