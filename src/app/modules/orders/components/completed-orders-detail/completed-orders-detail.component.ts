import { LocalStorageService } from './../../../../core/services/storage.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { OrdersService } from './../../services/orders.service';
import { ReportsService } from './../../../reports/services/reports.service';
import { ToasterService } from './../../../../core/services/toaster.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-completed-orders-detail',
  templateUrl: './completed-orders-detail.component.html',
  styleUrls: ['./completed-orders-detail.component.css'],
})
export class CompletedOrdersDetailComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  loading = false;
  date =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();
  loadsheets = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private toastService: ToasterService,
    private ls: LocalStorageService
  ) {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  routeToPdf(mod, sheet) {
    if (mod == 'ls')
      window.open(
        `${environment.apiDomain}/LoadSheetDataPdf/${sheet.id}/${sheet.salesman_id}/${sheet.date}`,
        '_blank'
      );
    else if (mod == 'bs')
      window.open(
        `${environment.apiDomain}/BookingSheetPdf?emp=${sheet.salesman_id}&date=${sheet.date}&loadId=${sheet.id}`,
        '_blank'
      );
    else if (mod == 'bills')
      window.open(
        `${environment.apiDomain}/GetAllBillsDetail?type=bill&emp=${
          sheet.salesman_id
        }&date=${sheet.date}&dist_id=${
          this.ls.getItem('distributor').id
        }&size=A4&status=processed&loadId=${sheet.id}`,
        '_blank'
      );
    else if (mod == 'dsr')
      window.open(
        `${environment.apiDomain}/pdfDSRNew/${sheet.dsrId}`,
        '_blank'
      );
  }

  getData() {
    this.loading = true;

    // TO destroy
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.isDtInitialized = false;
    }

    this.ordersService
      .getCompletedOrdersLoadsheets(this.date)
      .subscribe((res) => {
        this.loadsheets = res;

        if (!this.isDtInitialized) {
          this.isDtInitialized = true;
          this.dtTrigger.next();
        }
        this.loading = false;
      });
  }
}
