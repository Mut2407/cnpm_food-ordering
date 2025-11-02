import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { OrderManagementComponent } from '../order-management/order-management.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserManagementComponent },
  { path: 'restaurants', component: RestaurantManagementComponent },
  { path: 'orders', component: OrderManagementComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserManagementComponent },
      { path: 'restaurants', component: RestaurantManagementComponent },
      { path: 'orders', component: OrderManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingRoutingModule { }
