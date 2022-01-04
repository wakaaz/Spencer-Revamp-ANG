import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimaryOrdersRoutingModule } from './primary-orders-routing.module';
import { PrimaryOrdersListComponent } from './components/primary-orders/primary-orders.component';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PrimaryOrdersService } from './services/primary-orders.service';

@NgModule({
  declarations: [PrimaryOrdersListComponent, ListComponent],
  imports: [
    CommonModule,
    PrimaryOrdersRoutingModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    NgSelectModule,
  ],
  providers: [PrimaryOrdersService],
})
export class PrimaryOrdersModule {}
