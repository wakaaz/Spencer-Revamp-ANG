import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrdersListDetailsComponent } from './components/orders-list-details/orders-list-details.component';
import { CreateDispatchedComponent } from './components/create-dispatched/create-dispatched.component';
import { OrderExecutionListComponent } from './components/execution-list/execution-list.component';
import { ExecuteOrderComponent } from './components/execute-order/execute-order.component';
import { CompletedOrdersComponent } from './components/completed-orders/completed-orders.component';
import { CounterSaleComponent } from './components/counter-sale/counter-sale.component';
import { BookingVsExecutionComponent } from './components/booking-vs-execution/booking-vs-execution.component';
import { CompletedOrdersDetailComponent } from './components/completed-orders-detail/completed-orders-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: OrdersListComponent
        },
        {
            path: 'order-list-details',
            pathMatch: 'full',
            component: OrdersListDetailsComponent
        },
        {
            path: 'dispatch-orders',
            pathMatch: 'full',
            component: CreateDispatchedComponent
        },
        {
            path: 'execution-list',
            pathMatch: 'full',
            component: OrderExecutionListComponent
        },
        {
            path: 'execute-order',
            pathMatch: 'full',
            component: ExecuteOrderComponent
        },
        {
            path: 'completed-orders',
            pathMatch: 'full',
            component: CompletedOrdersComponent
        },
        {
            path: 'completed-orders/:id',
            pathMatch: 'full',
            component: CompletedOrdersDetailComponent,
        },
        {
            path: 'counter-sale',
            pathMatch: 'full',
            component: CounterSaleComponent
        },
        {
            path: 'booking-vs-execution',
            pathMatch: 'full',
            component: BookingVsExecutionComponent
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
