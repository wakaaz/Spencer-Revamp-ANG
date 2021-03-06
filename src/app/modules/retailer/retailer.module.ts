import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { SharedModule } from '../shared/shared.module';
import { RetailerRoutingModule } from './retailer-routing.module';

import { RetailerComponent } from './retailer.component';
import { RetalersListComponent } from './components/retailers-list/retailers-list.component';
import { RetailerProfileComponent } from './components/retailer-profile/retailer-profile.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { RetailerService } from './services/retailer.service';
import { LedgerComponent } from './components/ledger/ledger.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DataTablesModule,
        ClickOutsideModule,
        NgSelectModule,
        ChartsModule,
        RetailerRoutingModule,
    ],
    declarations: [
        RetailerComponent,
        RetalersListComponent,
        RetailerProfileComponent,
        OpeningBalanceComponent,
        LedgerComponent,
    ],
    providers: [
        RetailerService
    ],
})
export class RetailerModule { }
