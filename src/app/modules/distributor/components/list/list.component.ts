import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { DistributorService } from '../../services/distributor.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  loading: boolean;
  distributors = [];

  constructor(
    private distributorService: DistributorService,
    private toastService: ToasterService
  ) {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.getDistributorListing();
    // retailer core api call
    // this.distributorService.getDistributorListing().subscribe((data) => {
    //   this.distributorCore = data;
    // });
  }
  getDistributorListing() {
    this.loading = true;
    this.distributorService.getDistributorListing().subscribe(
      (res) => {
        this.loading = false;
        this.distributors = res.data;
      },
      (error) => {
        this.loading = false;
        this.distributors = [];
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
}
