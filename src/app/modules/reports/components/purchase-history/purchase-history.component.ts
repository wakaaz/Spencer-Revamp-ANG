import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ToasterService } from 'src/app/core/services/toaster.service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css'],
})
export class PurchaseHisotryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  purchasesHistory: Array<any>;
  loading: boolean;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private reportService: ReportsService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.purchasesHistory = [];
    this.getPurchasesHistory();
  }

  getPurchasesHistory(): void {
    this.loading = true;
    this.reportService.getDistributorPurchaseHistory().subscribe(
      (res) => {
        this.loading = false;
        if (res.status === 200) {
          const historyData = res.data;
          this.purchasesHistory = historyData.map((history) => {
            return { ...history, payload: JSON.parse(history.payload) };
          });
          setTimeout(() => {
            this.dtTrigger.next();
          }, 1);
        }
      },
      (error) => {
        if (error.status !== 1 && error.status !== 401) {
          this.toastService.showToaster({
            title: 'Error:',
            type: 'error',
            message: 'Something went wrong please try again',
          });
        }
      }
    );
  }
}
