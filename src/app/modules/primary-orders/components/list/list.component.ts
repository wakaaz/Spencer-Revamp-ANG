import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { PrimaryOrdersService } from '../../services/primary-orders.service';

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
      this.orderDetial = null;
      {
        this.orderDetial = res.data;
        console.log(this.orderDetial);
      }
    });
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
}
