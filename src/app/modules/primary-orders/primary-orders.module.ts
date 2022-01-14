import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimaryOrdersRoutingModule } from './primary-orders-routing.module';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PrimaryOrdersService } from './services/primary-orders.service';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { PrimaryOrdersComponent } from './primary-orders.component';
import { OrdersService } from '../orders/services/orders.service';

@NgModule({
  declarations: [PrimaryOrdersComponent, ListComponent, EditOrderComponent],
  imports: [
    CommonModule,
    PrimaryOrdersRoutingModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    NgSelectModule,
  ],
  providers: [PrimaryOrdersService, OrdersService],
})
export class PrimaryOrdersModule {}
