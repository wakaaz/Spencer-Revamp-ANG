import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { ListComponent } from './components/list/list.component';
import { PrimaryOrdersComponent } from './primary-orders.component';

const routes: Routes = [
  {
    path: '',
    component: PrimaryOrdersComponent,
    children: [
      {
        path: ':status',
        pathMatch: 'full',
        component: ListComponent,
      },
      {
        path: ':status/:new',
        pathMatch: 'full',
        component: EditOrderComponent,
      },
      {
        path: ':status/edit/:orderId',
        pathMatch: 'full',
        component: EditOrderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrimaryOrdersRoutingModule {}
