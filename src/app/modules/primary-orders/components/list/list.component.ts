import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PRIMARY_ORDER,
  PRIMARY_ORDER_API_STATUS,
  PRIMARY_ORDER_API_STATUS_UPDATE,
} from 'src/app/core/constants/primary-orders-parms.constants';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { PrimaryOrdersService } from '../../services/primary-orders.service';
import { PrimaryOrder } from '../../_models/order';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  readonly PRIMARY_ORDER_CONST = PRIMARY_ORDER;
  readonly PRIMARY_ORDER_STATUS_UPDATE = PRIMARY_ORDER_API_STATUS_UPDATE;
  orderStatus: string;
  confirmDeleteOrderID: number;
  orderStatusAPI: string;
  selectedOrderBooker: number;
  showDetailsPopup: boolean;
  submitted: boolean;
  byOrderBooker: boolean;
  loading: boolean;
  orderBookers: Array<any> = [];
  salesMen: Array<any> = [];
  primaryOrders: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  selectedOrders: Array<any> = [];
  orderDetial: any = null;
  order: PrimaryOrder;
  totalGrossAmt = 0.0;
  totalDiscount = 0.0;
  totalTax = 0.0;
  totalPkr = 0.0;
  frienghtPrice = 0.0;
  constructor(
    private primaryOrderService: PrimaryOrdersService,
    private toastService: ToasterService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.orderStatus = param.status;
      switch (this.orderStatus) {
        case PRIMARY_ORDER.BOOKED:
          this.orderStatusAPI = PRIMARY_ORDER_API_STATUS.BOOKED;
          break;
        case PRIMARY_ORDER.PROCESSED:
          this.orderStatusAPI = PRIMARY_ORDER_API_STATUS.PROCESSED;
          break;
        case PRIMARY_ORDER.EXECUTE:
          this.orderStatusAPI = PRIMARY_ORDER_API_STATUS.EXECUTE;
          break;
        case PRIMARY_ORDER.COMPLETED:
          this.orderStatusAPI = PRIMARY_ORDER_API_STATUS.COMPLETED;
          break;
        case PRIMARY_ORDER.CANCELED:
          this.orderStatusAPI = PRIMARY_ORDER_API_STATUS.CANCELED;
          break;
        default:
          break;
      }
      this.onInit();
    });
  }

  onInit(): void {
    // console.log(this.route.snapshot.params.status);
    this.byOrderBooker = true;
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.getPendingOrders();
  }
  getPendingOrders() {
    this.loading = true;
    this.primaryOrderService
      .getPendingOrdersList(this.orderStatusAPI)
      .subscribe((x) => {
        this.primaryOrders = [...x.data];
        this.loading = false;
      });
  }

  onOrderDetail(id: number) {
    this.loading = true;
    this.primaryOrderService.getOderDetailById(id).subscribe((res) => {
      this.order = new PrimaryOrder();
      {
        const orderRes = { ...res.data.order };
        this.order.distributor_name = orderRes.distributor_name;
        this.order.employee_name = orderRes.employee_name;
        this.order.date = orderRes.date;
        this.order.id = orderRes.id;
        this.order.distributor_phone = orderRes.distributor_phone;
        this.order.distributor_address = orderRes.distributor_address;
        this.order.status = orderRes.status;
        this.order.date = orderRes.date;
        this.order.employee_name = orderRes.employee_name;
        this.order.frieght_price = orderRes.frieght_price;
        this.order.orderContent = this.primaryOrderService.getPrimaryOrderItem([
          ...res.data.content,
        ]);
        this.loading = false;
      }
    });
  }

  getTotalDiscount(item: any): number {
    return (
      this.getTradeOfferDiscount(item) +
      this.getDistributorDiscount(item) +
      this.getSpecialDiscount(item) +
      this.getBookDiscount(item)
    );
  }

  getTradeOfferDiscount(item: any): number {
    return item?.scheme_id !== 0
      ? item?.booked_total_qty *
          ((item?.booked_total_qty * item?.unit_price) /
            item?.itemscheme_min_quantity +
            item?.scheme_quantity_free)
      : 0;
  }
  getDistributorDiscount(item: any): number {
    return (this.totalGrossAmt * item?.distributor_discount) / 100;
  }
  getSpecialDiscount(item: any): number {
    return (
      ((item?.special_discount * item?.unit_price) / 100) *
      item?.special_discount
    );
  }
  getBookDiscount(item: any): number {
    return item?.booker_discount * item?.booked_total_qty;
  }

  addOrderToAssignment(order: any): void {
    this.selectedOrders = this.selectedOrders.filter(
      (odr) => odr.id !== order.id
    );
    const assignment = {
      sales_man: order.selectedSaleman.id,
      employee_id: order.employee_id,
      id: order.id,
      date: order.date,
    };
    this.selectedOrders.push(assignment);
  }

  openDetailsModal(order: any): void {
    document.body.classList.add('no-scroll');
  }

  closeDetailsModal(): void {
    document.body.classList.remove('no-scroll');
  }
  onUpdateOrderStatus(id: number, status: string) {
    this.loading = true;
    this.primaryOrderService.updateOrderStatus(id, status).subscribe(
      (res) => {
        this.onInit();
      },
      (err) => {
        console.log('err => ', err);
      }
    );
  }

  onConfirmationDelete(orderId: number) {
    this.confirmDeleteOrderID = orderId;
  }
}
