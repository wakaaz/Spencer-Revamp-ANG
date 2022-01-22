import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';

import { WhiteLoaderComponent } from './components/loader-white/loader-white.component';
import { OrderItemsListComponent } from './components/order-items/order-items.component';
import { ProductsRightPanelComponent } from './components/product-right-panel/product-right-panel.compoent';
import { RetailerSubListComponent } from './components/retailer-sub-listing/retailer-sub-listing.component';
import { ReturnedProductsComponent } from './components/returned-products/returned-products.component';
import { Decimal } from './pipes/decimal.pipe';
import { PipeModule } from './pipes/pipe.module';
import { DataService, GeneralDataService } from './services';

const components = [
    RetailerSubListComponent,
    OrderItemsListComponent,
    WhiteLoaderComponent,
    ProductsRightPanelComponent,
    ReturnedProductsComponent,
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgSelectModule,
        PipeModule,
    ],
    exports: [
        ...components,
        Decimal],
    declarations: [...components],
    providers: [
        GeneralDataService,
        DataService,
        PipeModule,
    ],
})
export class SharedModule {
    static forRoot(): any {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
