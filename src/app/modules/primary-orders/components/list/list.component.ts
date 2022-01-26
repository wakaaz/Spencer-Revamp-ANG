import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { PrimaryOrdersService } from '../../services/primary-orders.service';
import { PrimaryOrder } from '../../_models/order';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
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
    // private generalDataService: GeneralDataService,
    private primaryOrderService: PrimaryOrdersService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.byOrderBooker = true;
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.getPendingOrders();
  }
  getPendingOrders() {
    this.loading = true;
    this.primaryOrderService.getPendingOrdersList().subscribe((x) => {
      console.log('x => ', x.data);
      this.primaryOrders = [...x.data];
      this.loading = false;
    });
  }

  onOrderDetail(id: number) {
    // alert(id);
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
        // this.orderDetial = { ...res.data };
        // this.order = { ...res.data.order };
        // console.log(this.order);
        // console.log(this.orderDetial.content);
        this.setOrderTotals();
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
  getAllSalesMen(): void {
    // this.generalDataService.getAllSalesMen().subscribe(res => {
    //     if (res.status === 200) {
    //         this.salesMen = res.data;
    //     }
    // }, error => {
    //     if (error.status !== 401 && error.status !== 1) {
    //         this.toastService.showToaster({
    //             title: 'Error:',
    //             message: 'Salesmen not fetched, try again later.',
    //             type: 'error'
    //         });
    //     }
    // });
  }

  getNewOrders(): void {
    // this.loading = true;
    // this.ordersService.getNewOrders().subscribe(res => {
    //     this.loading = false;
    //     if (res.status === 200) {
    //         this.orders = res.data;
    //     }
    // }, error => {
    //     this.loading = false;
    //     if (error.status !== 401 && error.status !== 1) {
    //         this.toastService.showToaster({
    //             title: 'Error:',
    //             message: 'New Orders not fetched, try again later.',
    //             type: 'error'
    //         });
    //     }
    //     scrollTo(0, 0);
    // });
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

  assignSaleman(): void {
    // if (this.selectedOrders.length) {
    //     const assigned = {
    //         salesman: this.selectedOrders.map(x => {
    //             const { sales_man, employee_id, date } = x;
    //             return { sales_man, employee_id, date };
    //         })
    //     };
    //     this.loading = true;
    //     this.ordersService.assignSalesMan(assigned).subscribe(res => {
    //         if (res.status) {
    //             this.toastService.showToaster({
    //                 title: 'Salesman Assigned:',
    //                 message: 'Salesmen assigned to selected order.',
    //                 type: 'success'
    //             });
    //             this.selectedOrders.forEach(order => {
    //                 this.orders = this.orders.filter(ordr => ordr.id !== order.id);
    //             });
    //             this.loading = false;
    //             this.selectedOrders = [];
    //           }
    //     }, error => {
    //         this.loading = false;
    //         if (error.status !== 401 && error.status !== 1) {
    //             this.toastService.showToaster({
    //                 title: 'Error:',
    //                 message: 'Salesmen assignment is not working at the moment, try again later.',
    //                 type: 'error'
    //             });
    //         }
    //         scrollTo(0, 0);
    //     });
    // } else {
    //     this.toastService.showToaster({
    //         title: 'Error:',
    //         message: 'Please select saleman to assign orders!',
    //         type: 'error'
    //     });
    // }
  }

  openDetailsModal(order: any): void {
    document.body.classList.add('no-scroll');
  }

  closeDetailsModal(): void {
    document.body.classList.remove('no-scroll');
  }
  setOrderTotals() {
    const length = this.orderDetial.content.length;
    for (let i = 0; i < length; i++) {
      this.totalGrossAmt +=
        this.orderDetial.content[i].unit_price *
        this.orderDetial.content[i].booked_total_qty;
      this.totalDiscount += this.getTotalDiscount(this.orderDetial.content[i]);
      this.totalTax += this.orderDetial.content[i].tax_amount;
    }
    this.totalPkr =
      this.totalGrossAmt -
      this.totalDiscount +
      this.totalTax +
      this.frienghtPrice;
  }
}
