import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { GeneralDataService } from '../../../shared/services';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrdersListComponent implements OnInit {
  selectedOrderBooker: number;
  showDetailsPopup: boolean;
  submitted: boolean;
  byOrderBooker: boolean;
  loading: boolean;
  orderBookers: Array<any> = [];
  salesMen: Array<any> = [];
  orders: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  selectedOrders: Array<any> = [];

  constructor(
    private generalDataService: GeneralDataService,
    private ordersService: OrdersService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.byOrderBooker = true;
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.getAllSalesMen();
    this.getNewOrders();
  }

  getAllSalesMen(): void {
    this.generalDataService.getAllSalesMen().subscribe(
      (res) => {
        if (res.status === 200) {
          this.salesMen = res.data;
        }
      },
      (error) => {
        if (error.status !== 401 && error.status !== 1) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Salesmen not fetched, try again later.',
            type: 'error',
          });
        }
      }
    );
  }

  getNewOrders(): void {
    this.loading = true;
    this.ordersService.getNewOrders().subscribe(
      (res) => {
        this.loading = false;
        if (res.status === 200) {
          this.orders = res.data;
        }
      },
      (error) => {
        this.loading = false;
        if (error.status !== 401 && error.status !== 1) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'New Orders not fetched, try again later.',
            type: 'error',
          });
        }
        scrollTo(0, 0);
      }
    );
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
    if (this.selectedOrders.length) {
      const assigned = {
        salesman: this.selectedOrders.map((x) => {
          const { sales_man, employee_id, date } = x;
          return { sales_man, employee_id, date };
        }),
      };
      this.loading = true;
      this.ordersService.assignSalesMan(assigned).subscribe(
        (res) => {
          if (res.status) {
            this.toastService.showToaster({
              title: 'Salesman Assigned:',
              message: 'Salesmen assigned to selected order.',
              type: 'success',
            });
            this.selectedOrders.forEach((order) => {
              this.orders = this.orders.filter((ordr) => ordr.id !== order.id);
            });
            this.loading = false;
            this.selectedOrders = [];
          }
        },
        (error) => {
          this.loading = false;
          if (error.status !== 401 && error.status !== 1) {
            this.toastService.showToaster({
              title: 'Error:',
              message:
                'Salesmen assignment is not working at the moment, try again later.',
              type: 'error',
            });
          }
          scrollTo(0, 0);
        }
      );
    } else {
      this.toastService.showToaster({
        title: 'Error:',
        message: 'Please select saleman to assign orders!',
        type: 'error',
      });
    }
  }

  openDetailsModal(order: any): void {
    document.body.classList.add('no-scroll');
  }

  closeDetailsModal(): void {
    document.body.classList.remove('no-scroll');
  }
}
