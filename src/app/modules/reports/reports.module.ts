import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ReportsComponent } from './reports.component';
import { PurchaseHisotryComponent } from './components/purchase-history/purchase-history.component';
import { DSReportComponent } from './components/dsr/dsr.component';
import { ReportsService } from './services/reports.service';
import { PurchasedDetailComponent } from './components/purchase-detail/purchase-detail.component';
import { CashSummaryComponent } from './components/cash-summary/cash-summary.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        SharedModule,
        ReportsRoutingModule,
    ],
    declarations: [
        ReportsComponent,
        PurchaseHisotryComponent,
        PurchasedDetailComponent,
        DSReportComponent,
        CashSummaryComponent,
    ],
    providers: [
        ReportsService,
    ],
})
export class ReportsModule { }
