import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routes';
import { AuthGuard } from '../services/auth.guard';


const rutasHijas:Routes = [
    { 
      path: '', 
      component: DashboardComponent,
      children: DashboardRoutes, 
      //canActivate: [ AuthGuard ]
    },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas ),
  ], 
  exports:[
    RouterModule
  ]
})
export class DashboardRoutesModule { }
