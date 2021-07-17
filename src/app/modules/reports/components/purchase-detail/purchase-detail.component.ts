import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster, ToasterService } from 'src/app/core/services/toaster.service';
import { ReportsService } from '../../services/reports.service';

@Component({
    selector: 'app-purchase-detail',
    templateUrl: './purchase-detail.component.html',
    styleUrls: ['./purchase-detail.component.css']
})

export class PurchasedDetailComponent implements OnInit {

    loading: boolean;
    order: any;
    orderId: any;
    constructor(
        private route: ActivatedRoute,
        private toastService: ToasterService,
        private reportService: ReportsService,
    ) {
    }

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.getOrderDetails();
    }

    getOrderDetails(): void {
        this.loading = true;
        this.reportService.getPurchasedOrderDetais(this.orderId).subscribe(res => {
            this.loading = false;
            if (res.status === 200) {
                const data = res.data;
                this.order = {...data, payload: JSON.parse(data.payload)};
            }
        }, error => {
            if (error.status !== 1 && error.status !== 401) {
                const toast: Toaster = { title: 'Error:', message: 'Something went wrong please try again', type: 'error' };
                this.toastService.showToaster(toast);
            }
        });
    }



}
