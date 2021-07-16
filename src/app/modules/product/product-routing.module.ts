import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
        {
            path: ':id',
            component: ProductDetailsComponent
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
