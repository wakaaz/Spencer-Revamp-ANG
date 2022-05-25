import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { environment } from 'src/environments/environment';
import { DataService, GeneralDataService } from '../../../shared/services';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: 'add-stock.component.html',
  styleUrls: ['./add-stock.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddStockComponent implements OnInit {
  BASE_URL = environment.apiDomain;
  dtOptions: DataTables.Settings = {};
  products: Array<any> = [];
  dispProducts: Array<any> = [];
  categories: Array<any> = [];
  brands: Array<any> = [];
  stock: Array<any> = [];
  units: Array<string> = [];
  submitted: boolean;
  loading: boolean;
  selectedUnit: string;
  selectedBrand: string;
  selectedCategory: string;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private generalDataService: GeneralDataService,
    private dataService: DataService,
    private toastService: ToasterService
  ) {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
  }

  ngOnInit(): void {
    this.submitted = false;
    this.units = [
      'All Units',
      'Piece',
      'Box',
      'Carton',
      'Dozen',
      'Half Dozen',
      'Strip',
      '12 Pack',
      '18 Pack',
      'Jar',
    ];
    this.selectedUnit = 'All Units';
    this.selectedBrand = 'all';
    this.selectedCategory = 'all';
    this.getAllProducts();
    this.getBrands();
    this.getCategories();
  }

  getAllProducts(): void {
    this.loading = true;
    this.generalDataService.getProductsWithPrefType('secondary').subscribe(
      (res: any) => {
        this.loading = false;
        if (res.status === 200) {
          this.products = res.data;
          this.dispProducts = JSON.parse(JSON.stringify(this.products));
        }
      },
      (error) => {
        this.loading = false;
        if (error.status !== 1 && error.status !== 401) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Something went wrong while fetching products!',
            type: 'error',
          });
        }
      }
    );
  }

  isNumber(event: KeyboardEvent): boolean {
    return this.dataService.isNumber(event, 'quantity');
  }

  getBrands(): void {
    this.inventoryService.getBrnads().subscribe(
      (res: any) => {
        this.brands = res.data;
      },
      (error) => {
        console.log('Error while getting brands', error);
      }
    );
  }

  correctIamgeURL() {
    this.dispProducts.forEach((x) => {
      const urlArray = x.thumbnail.split('/');
      if (urlArray[0] === 'https:') {
        x.thumbnail =
          this.BASE_URL + '/' + x.thumbnail.split('/').splice(3).join('/');
      } else {
        x.thumbnail = this.BASE_URL + '/' + x.thumbnail;
      }
    });
  }
  getCategories(): void {
    this.inventoryService.getCategories().subscribe(
      (res: any) => {
        this.categories = res.data;
      },
      (error) => {
        console.log('Error while getting brands', error);
      }
    );
  }

  filterProducts(): void {
    this.loading = true;
    const selected = [];
    if (this.selectedBrand !== 'all') {
      const brand = (product) =>
        product.brand_name.toLowerCase() === this.selectedBrand.toLowerCase();
      selected.push(brand);
    }
    if (this.selectedUnit !== 'All Units') {
      const brand = (product) =>
        product.unit_name.toLowerCase() === this.selectedUnit.toLowerCase();
      selected.push(brand);
    }
    if (this.selectedCategory !== 'all') {
      const category = (product) =>
        product.sub_cat.toLowerCase() === this.selectedCategory.toLowerCase();
      selected.push(category);
    }
    if (selected.length) {
      const filteredProducts = this.products.filter((product) =>
        selected.every((f) => f(product))
      );
      this.dispProducts = JSON.parse(JSON.stringify(filteredProducts));
    } else {
      this.dispProducts = JSON.parse(JSON.stringify(this.products));
    }
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  addProduct(product: any): void {
    product.isAdded = true;
    const { pref_id, unit_id, item_id, unit_name, item_name } = product;
    this.stock.push({
      pref_id,
      unit_id,
      item_id,
      unit_name,
      item_name,
      quantity: product.stockQty,
    });
  }

  removeProduct(product: any): void {
    product.isAdded = false;
    this.stock = this.stock.filter((x) => x.item_id !== product.item_id);
  }

  addOpeningStock(): void {
    if (this.stock.length) {
      this.submitted = true;
      this.inventoryService.addDistributorOpeningStock(this.stock).subscribe(
        (res) => {
          this.submitted = false;
          if (res.status === 200) {
            this.toastService.showToaster({
              title: 'Stock Added',
              message: 'Opening Stock added successfully!',
              type: 'success',
            });
            this.router.navigateByUrl('/retailer/opening-balance');
          } else if (res.status === 208) {
            this.toastService.showToaster({
              title: 'Error:',
              message:
                'Your stock already added. If you want to add more stock go to Distributor Purchase!',
              type: 'error',
            });
          }
        },
        (error) => {
          this.submitted = false;
          if (error.status !== 1 && error.status !== 401) {
            this.toastService.showToaster({
              title: 'Error:',
              message: 'Something went wrong while adding stock!',
              type: 'error',
            });
          }
        }
      );
    } else {
      this.toastService.showToaster({
        title: 'Error:',
        message: 'Please select product with quantity to add in stock!',
        type: 'error',
      });
    }
  }
}
