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
        path: '',
        pathMatch: 'full',
        component: ListComponent,
      },
      {
        path: 'edit/:orderId',
        pathMatch: 'full',
        component: EditOrderComponent,
      },
      //   {
      //     path: 'dispatch-orders',
      //     pathMatch: 'full',
      //     component: CreateDispatchedComponent
      //   },
      //   {
      //     path: 'dispatch/:assignId/:saleManId/:date',
      //     pathMatch: 'full',
      //     component: OrderDispatchedComponent
      //   },
      //   {
      //     path: 'execution-list',
      //     pathMatch: 'full',
      //     component: OrderExecutionListComponent
      //   },
      //   {
      //     path: 'execute-order/:saleManId/:date/:loadId',
      //     pathMatch: 'full',
      //     component: ExecuteOrderComponent
      //   },
      //   {
      //     path: 'completed-orders',
      //     pathMatch: 'full',
      //     component: CompletedOrdersDetailComponent
      //   },
      //   {
      //     path: 'completed-orders/:id',
      //     pathMatch: 'full',
      //     component: CompletedOrdersDetailComponent,
      //   },
      //   {
      //     path: 'counter-sale',
      //     pathMatch: 'full',
      //     component: CounterSaleComponent
      //   },
      //   {
      //     path: 'booking-vs-execution',
      //     pathMatch: 'full',
      //     component: BookingVsExecutionComponent
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrimaryOrdersRoutingModule {}
