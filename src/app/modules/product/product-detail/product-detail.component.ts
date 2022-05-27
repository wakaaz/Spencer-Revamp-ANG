import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { environment } from 'src/environments/environment';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  BASE_URL = environment.apiDomain;

  dtOptions: DataTables.Settings = {};
  productId: number;
  product: any;
  loader: boolean;
  activeSlide: number;
  sliderInterval: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.productId = +this.route.snapshot.paramMap.get('id');
    this.getProduct();
  }

  getProduct(): void {
    this.loader = true;
    this.productService.getProduct(this.productId).subscribe(
      (res) => {
        this.loader = false;
        if (res.status === 200) {
          this.product = res.data;
          this.activeSlide = 0;
          this.startSlider();
        }
      },
      (error) => {
        this.loader = false;
        if (error.status !== 1 && error.status !== 401) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Something went wrong while fetching product detail!',
            type: 'error',
          });
          console.log('error :>> ', error);
        }
      }
    );
  }

  startSlider(): void {
    if (this.product.images?.length > 1) {
      this.sliderInterval = setInterval(() => {
        if (this.activeSlide !== this.product.images.length - 1) {
          this.activeSlide += 1;
        } else {
          this.activeSlide = 0;
        }
      }, 10000);
    }
  }

  slideTo(id: number): void {
    this.activeSlide = id;
    this.startSlider();
  }

  ngOnDestroy(): void {
    this.sliderInterval = null;
  }

  correctIamgeURL() {
    // this.allProducts.forEach((x) => {
    const urlArray = this.product.thumbnail.split('/');
    if (urlArray[0] === 'https:') {
      this.product.thumbnail =
        this.BASE_URL +
        '/' +
        this.product.thumbnail.split('/').splice(3).join('/');
    } else {
      this.product.thumbnail = this.BASE_URL + '/' + this.product.thumbnail;
    }
    // });
  }
}
