import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-gallerty-component',
  templateUrl: 'gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  searchText: string;
  sortFilter: string;
  BASE_URL = environment.apiDomain;

  selectedBrand: string;
  selectedCategory: string;

  totalProducts: number;
  pageNum: number;
  pageCount: number;
  productsPerPage: number;
  lastVisitedPage: number;

  showList: boolean;
  loading: boolean;
  loadingError: boolean;

  timer: any;

  products: Array<any>;
  productsFilteredArray: Array<any>;
  productDispList: Array<any>;
  categories: Array<any>;
  brands: Array<any>;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.searchText = '';
    this.sortFilter = '0';
    this.selectedBrand = 'All Brands';
    this.selectedCategory = 'All Categories';
    this.totalProducts = 0;
    this.productsPerPage = 12;
    this.showList = true;
    this.loading = false;
    this.loadingError = false;
    this.getAllProducts();
    this.getBrands();
    this.getCategories();
  }

  getAllProducts(): void {
    this.loading = true;
    this.loadingError = false;
    this.inventoryService.getProducts().subscribe(
      (res: any) => {
        this.loading = false;
        if (res.status === 200) {
          this.products = res.data;
          console.log(this.products[0].thumbnail);
          this.correctIamgeURL();
          this.countPagesAndProductsDisp(this.products);
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 1) {
          this.loadingError = true;
        }
      }
    );
  }
  correctIamgeURL() {
    this.products.forEach((x) => {
      const urlArray = x.thumbnail.split('/');
      console.log(urlArray);
      if (urlArray[0] === 'https:') {
        x.thumbnail =
          this.BASE_URL + '/' + x.thumbnail.split('/').splice(3).join('/');
      } else {
        x.thumbnail = this.BASE_URL + '/' + x.thumbnail;
      }
    });
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

  countPagesAndProductsDisp(products: Array<any>): void {
    this.totalProducts = products.length;
    this.pageCount = Math.ceil(this.totalProducts / 12);
    this.pageNum = 1;
    this.lastVisitedPage = 12;
    this.productsFilteredArray = JSON.parse(JSON.stringify(products));
    this.productDispList = products.slice(0, this.productsPerPage);
  }

  getProductsByPageID(page: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.pageNum = page;
    this.lastVisitedPage = this.productsPerPage * (page - 1);
    this.productDispList = this.productsFilteredArray.slice(
      this.lastVisitedPage,
      this.productsPerPage * this.pageNum
    );
  }

  filterProducts(): void {
    const selected = [];
    if (this.searchText) {
      const search = (item) =>
        item.item_name.toLowerCase().includes(this.searchText);
      selected.push(search);
    }
    if (this.selectedBrand !== 'All Brands') {
      const brand = (product) =>
        product.brand_name.toLowerCase() === this.selectedBrand.toLowerCase();
      selected.push(brand);
    }
    if (this.selectedCategory !== 'All Categories') {
      const category = (product) =>
        product.sub_cat.toLowerCase() === this.selectedCategory.toLowerCase();
      selected.push(category);
    }
    if (selected.length) {
      const filteredProducts = this.products.filter((product) =>
        selected.every((f) => f(product))
      );
      this.countPagesAndProductsDisp(filteredProducts);
    } else {
      this.countPagesAndProductsDisp(this.products);
    }
    if (this.sortFilter !== '0') {
      this.sortProducts();
    }
  }

  sortProducts(): void {
    switch (this.sortFilter) {
      case 'asc':
      case 'desc':
        this.productsFilteredArray = this.sortAscDesc(
          this.productsFilteredArray,
          this.sortFilter
        );
        break;

      case 'latest':
      case 'oldest':
        this.productsFilteredArray = this.sortAsCreated(
          this.productsFilteredArray,
          this.sortFilter
        );
        break;

      default:
        break;
    }
    this.countPagesAndProductsDisp(this.productsFilteredArray);
  }

  sortAscDesc(actualArray: Array<any>, sortBy: string): Array<any> {
    const sortedArray = actualArray.sort((a: any, b: any) => {
      if (sortBy === 'asc') {
        if (a.item_name.toLowerCase() > b.item_name.toLowerCase()) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (b.item_name.toLowerCase() > a.item_name.toLowerCase()) {
          return 1;
        } else {
          return -1;
        }
      }
    });
    return sortedArray;
  }

  sortAsCreated(actualArray: Array<any>, sortBy: string): Array<any> {
    const sortedArray = actualArray.sort((a: any, b: any) => {
      if (sortBy === 'latest') {
        if (a.item_id > b.item_id) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (b.item_id > a.item_id) {
          return 1;
        } else {
          return -1;
        }
      }
    });
    return sortedArray;
  }

  resetTimer(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  getRange(start: number, pageCount): Array<number> {
    return Array.apply(0, Array(pageCount)).map(
      (element: number, j: number) => {
        return j + start;
      }
    );
  }
}
