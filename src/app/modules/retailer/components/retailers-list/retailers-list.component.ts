import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { RetailerService } from '../../services/retailer.service';

@Component({
  selector: 'app-retailers-list',
  templateUrl: 'retailers-list.component.html',
  styleUrls: ['./retailers-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RetalersListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  orderBooker: string = null;
  shopIdOrName: string = null;
  route: string = null;
  segment: string = null;
  shwoSaleManLedger: boolean;
  retailers = [];
  retailerCore: any;
  loading: boolean;

  constructor(
    private retailerService: RetailerService,
    private toastService: ToasterService,
    private router: Router
  ) {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.getRetailerListing();
    // retailer core api call
    this.retailerService.getRetailerCore().subscribe((data) => {
      this.retailerCore = data;
    });
  }

  getRetailerListing(queryParams = null): void {
    this.loading = true;
    this.retailerService.getRetailerListing(queryParams).subscribe(
      (res) => {
        this.loading = false;
        this.retailers = res;
      },
      (error) => {
        this.loading = false;
        this.retailers = [];
        if (error.status !== 401 && error.status !== 1) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Retailers not fetched, try again later.',
            type: 'error',
          });
        }
      }
    );
  }
  openSalemanLedger(event: Event): void {
    event.stopPropagation();
    this.shwoSaleManLedger = true;
    document.body.classList.add('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.add('d-block');
    document.getElementById('retailer-list').classList.add('blur-div');
  }

  clickedOutSide(event: Event): void {
    if (
      this.shwoSaleManLedger &&
      !(event.target as HTMLElement).classList.contains('paginate_button')
    ) {
      this.closeSalemanLedger();
    }
  }

  closeSalemanLedger(): void {
    this.shwoSaleManLedger = false;
    document.body.classList.remove('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.remove('d-block');
    document.getElementById('retailer-list').classList.remove('blur-div');
  }

  goToProfile(): void {
    console.log('Coming soon!');
  }

  onSearch(): void {
    let params = '';
    params =
      params +
      (this.orderBooker ? `order_booker=${this.orderBooker}` : params + '');
    params = params.length
      ? this.route
        ? params + `&route=${this.route}`
        : params + ''
      : this.route
      ? params + `route=${this.route}`
      : params + '';
    params = params.length
      ? this.segment
        ? params + `&segment=${this.segment}`
        : params + ''
      : this.segment
      ? params + `segment=${this.segment}`
      : params + '';
    params = params.length
      ? this.shopIdOrName
        ? params + `&shop=${this.shopIdOrName}`
        : params + ''
      : this.shopIdOrName
      ? params + `shop=${this.shopIdOrName}`
      : params + '';

    this.getRetailerListing(params);
  }
  getQueryParam(retailer: any) {
    return JSON.stringify(retailer);
  }
}
