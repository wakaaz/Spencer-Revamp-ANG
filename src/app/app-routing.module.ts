import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'salesmen',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/salesmen/salesmen.module').then(m => m.SalesmenModule)
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrderModule)
  },
  {
    path: 'product',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
