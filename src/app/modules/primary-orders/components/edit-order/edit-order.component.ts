import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimaryOrdersService } from '../../services/primary-orders.service';
import { PrimaryOrder } from '../../_models/order';
import { OrderItems } from '../../_models/orderItems';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  order: PrimaryOrder;
  orderContent: OrderItems[];
  constructor(
    private actr: ActivatedRoute,
    private primarySrvc: PrimaryOrdersService
  ) {}

  ngOnInit(): void {
    const orderId = this.actr.snapshot.params.orderId;
    this.primarySrvc.getOderDetailById(orderId).subscribe((x: any) => {
      this.order = { ...x.data.order };
      this.orderContent = [...x.data.content];
    });
  }

  onExtraDiscountChange(index: number): void {
    if (this.orderContent[index].booker_discount <= 0) {
      return;
    }
    const netAmmount =
      this.orderContent[index].booked_total_qty *
        this.orderContent[index].unit_price -
      (this.orderContent[index].scheme_id &&
      this.orderContent[index].scheme_id !== 0
        ? this.orderContent[index].booked_total_qty *
          ((this.orderContent[index].booked_total_qty *
            this.orderContent[index].unit_price) /
            this.orderContent[index].scheme_min_quantity +
            this.orderContent[index].scheme_quantity_free)
        : 0) -
      0 -
      ((this.orderContent[index].unit_price *
        this.orderContent[index].distributor_discount) /
        100) *
        this.orderContent[index].booked_total_qty -
      ((this.orderContent[index].unit_price *
        this.orderContent[index].special_discount) /
        100) *
        this.orderContent[index].booked_total_qty;
    if (this.orderContent[index].booker_discount >= netAmmount) {
      this.orderContent[index].booker_discount = 0;
    }
  }
}
