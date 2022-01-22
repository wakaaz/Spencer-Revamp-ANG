import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { Decimal } from './decimal.pipe';

@NgModule({
    imports: [],
    declarations: [Decimal],
    exports: [Decimal],
    providers: [
        DecimalPipe
    ]
})

export class PipeModule {

    // tslint:disable-next-line:typedef
    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
