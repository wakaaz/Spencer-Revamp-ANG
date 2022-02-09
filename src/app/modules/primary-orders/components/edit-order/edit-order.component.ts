import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster, ToasterService } from 'src/app/core/services/toaster.service';
import { PrimaryOrdersService } from '../../services/primary-orders.service';
import { IPrimaryOrder, PrimaryOrder } from '../../_models/order';
import {
  getNewPrimaryOderItem,
  IPrimaryOrderItem,
  PrimaryOrderItem,
} from '../../_models/orderItems';
import {
  freeProductsRules,
  schemes,
  SCHEME_RULES,
} from 'src/app/core/constants/schemes.constant';
import { DataService } from 'src/app/modules/shared/services';
import { IOrderItemDto } from '../../_models/orderItemDtos';
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  //#region Fields and Construct on int
  order: PrimaryOrder;
  orderItemDtos: IOrderItemDto[];
  showProducts = false;
  dispProducts: Array<any> = [];
  selectedProductsIds: Array<any> = [];
  showQuantityModal = false;
  merchantDiscount: any;
  loadingProducts = false;
  specialDiscounts: Array<any> = [];
  productSearchText: string;
  allProducts: Array<any> = [];
  subInventory: Array<any> = [];
  tradeoffers: Array<any> = [];
  selectedProduct: any = {};
  selectedProducts: Array<any> = [];
  selectedRegion: number;
  selectedSegment: number;
  grossAmount: number;
  isAdded: boolean = false;
  alreadyAdded: boolean = false;
  loading: boolean = false;
  saving: boolean = false;
  status: string;
  constructor(
    private actr: ActivatedRoute,
    public primarySrvc: PrimaryOrdersService,
    private toastService: ToasterService,
    private dataService: DataService,
    private router: Router
  ) {
    this.order = new PrimaryOrder();
  }

  ngOnInit(): void {
    this.loading = true;
    const orderId = this.actr.snapshot.params.orderId;
    this.status = this.actr.snapshot.params.status;
    this.getOrderbyOrderId(orderId);
  }

  //#region get order by orderId

  getOrderbyOrderId(orderId: number) {
    this.primarySrvc.getOderDetailById(orderId).subscribe((x: any) => {
      const orderRes = { ...x.data.order };
      this.order.distributor_name = orderRes.distributor_name;
      this.order.employee_name = orderRes.employee_name;
      this.order.date = orderRes.date;
      this.order.id = orderRes.id;
      this.order.frieght_price = orderRes.frieght_price;
      this.order.orderContent = this.primarySrvc.getPrimaryOrderItem([
        ...x.data.content,
      ]);
      this.getProductsMetaData();
      this.loading = false;
      //   this.primarySrvc.setOrderItemDtos([...this.orderContent]);
      //   console.log('ordercontent => ', this.orderContent[0]);
      // });
      // this.primarySrvc.orderItemDtos.subscribe((dto: IOrderItemDto[]) => {
      //   this.orderItemDtos = dto;
      // setInterval(() => {
      //   console.log(this.orderContent);
      // }, 2000);
    });
  }

  //#endregion

  //#region  show product list
  showProductsList(event: Event): void {
    event.stopPropagation();
    this.allProducts = this.allProducts.map((product) => {
      return product;
    });
    this.dispProducts = [...this.allProducts];
    this.showProducts = true;
    document.body.classList.add('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.add('d-block');
    document.getElementById('blureEffct-1').classList.add('blur-div');
  }
  //#endregion

  //#region API call get products meta data
  getProductsMetaData(): void {
    this.loadingProducts = true;
    this.primarySrvc.getProductsMetaData().subscribe(
      (res: any) => {
        if (res.status === 200) {
          for (let i = 0; i < this.order.orderContent.length; i++) {
            this.allProducts = res.data.inventory.map((pr) => {
              if (this.order.orderContent[i].item_id === pr.item_id) {
                pr.isAdded = true;
              } else {
                pr.isAdded = false;
              }
              pr.net_amount = 0.0;
              return pr;
            });
          }

          this.specialDiscounts = res.data.special_discount;
          // this.prefrences = res.data.prefs;
          this.dispProducts = [...this.allProducts];
          this.subInventory = res.data.sub_inventory;
          this.tradeoffers = res.data.tradeoffers;
          this.loadingProducts = false;
        } else {
          const toast: Toaster = {
            type: 'error',
            message: res.message,
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      },
      (error) => {
        this.loadingProducts = false;
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot fetch counter sale data. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }
  //#endregion

  //#region click outside event when side bar prod opened
  clickedOutSide(event: Event): void {
    if (
      this.showProducts &&
      !this.showQuantityModal &&
      !(event.target as HTMLElement).classList.contains('dont-close-products')
    ) {
      this.closeProductsList();
    }
  }
  //#endregion

  //#region close product list event
  closeProductsList(): void {
    this.showProducts = false;
    document.body.classList.remove('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.remove('d-block');
    document.getElementById('blureEffct-1').classList.remove('blur-div');
  }
  //#endregion

  //#region search inventory product
  searchProduct(): void {
    if (this.productSearchText) {
      this.dispProducts = this.allProducts.filter((prod) =>
        prod.item_name
          .toLowerCase()
          .includes(this.productSearchText.toLowerCase())
      );
    } else {
      this.dispProducts = this.allProducts.filter((prod) =>
        prod.item_name
          .toLowerCase()
          .includes(this.productSearchText.toLowerCase())
      );
    }
  }
  //#endregion

  //#region isAdded true or false for the display Product
  displayProductsIsAddedStatus(value: boolean = false, itemId: number = 0) {
    const dispProductsLength = this.dispProducts.length;
    for (let i = 0; i < dispProductsLength; i++) {
      if (this.dispProducts[i].item_id === itemId) {
        this.dispProducts[i].isAdded = value;
        break;
      }
    }
  }
  //#endregion

  //#region  add prioduct to order
  addProductToOrder(event: Event): void {
    this.order.orderContent.push(getNewPrimaryOderItem(this.selectedProduct));
    this.displayProductsIsAddedStatus(true, this.selectedProduct.item_id);
    this.showQuantityModal = false;
  }
  //#endregion

  //#region Remove product from order
  removeProductFromOrder(product: any): void {
    this.selectedProducts = this.selectedProducts.filter((x) => {
      if (x.item_id === product.item_id && x.unit_name !== product.unit_name) {
        return x;
      } else if (x.item_id !== product.item_id) {
        return x;
      }
    });
    this.allProducts = this.allProducts.map((prod) => {
      if (prod.item_id === product.item_id) {
        prod.isAdded = false;
      }
      return prod;
    });
    this.dispProducts = this.dispProducts.map((prod) => {
      if (prod.item_id === product.item_id) {
        prod.isAdded = false;
      }
      return prod;
    });
    this.selectedProductsIds = this.selectedProductsIds.filter(
      (x) => x !== product.item_id
    );
  }
  //#endregion

  //#region close qty model
  closeQuantityModal(event: Event): void {
    if (
      this.showQuantityModal &&
      !(event.target as HTMLElement).classList.contains('dont-close-quantity')
    ) {
      this.showQuantityModal = false;
      this.selectedProduct = {};
    }
  }
  //#endregion

  //#region open Quantity model
  openQuantityModal(product: any): void {
    this.showQuantityModal = true;
    if (product.schemes?.length) {
      product.schemes = product.schemes.map((scheme) => {
        scheme.isAvailable = false;
        switch (scheme.scheme_type) {
          case 'free_product':
            scheme.name = schemes.free_products;
            scheme.rule_name = freeProductsRules[scheme.scheme_rule];
            break;
          case 'dotp':
            scheme.name = schemes.dotp;
            break;
          default:
            scheme.name = schemes.gift;
            break;
        }
        return scheme;
      });
    }
    this.selectedProduct = { ...product };
    this.selectedProduct.selectedScheme = null;
    // this.selectedProduct.units = this.prefrences.filter(x => x.item_id === product.item_id);
  }
  //#endregion

  //#region set Quantity model
  setQuantity(product: any): void {
    if (+product.stockQty > 1000) {
      product.stockQty = 0;
    }
    if (product.item_trade_price) {
      if (this.selectedProducts.find((x) => x.item_id === product.item_id)) {
        this.grossAmount = this.grossAmount - product.original_amount || 0;
      }
    }
  }
  //#endregion

  //#region validatio isNumber
  isNumber(event: KeyboardEvent, type: string = 'charges'): boolean {
    return this.dataService.isNumber(event, type);
  }
  //#endregion

  //#region  apply gift scheme
  applyGiftScheme(product: any): any {
    return this.dataService.getSDForGift(product);
  }
  //#endregion

  //#region deleteOrderItem
  deleteOrderItem(itemId: number) {
    this.order.orderContent = this.order.orderContent.filter(
      (item) => item.item_id !== itemId
    );

    this.displayProductsIsAddedStatus(false, itemId);
  }

  //#endregion

  //#region saveOrder()

  saveOrder(): void {
    this.saving = true;
    this.primarySrvc.updateOrder(this.order).subscribe(
      (res) => {
        if (res.status === 200) {
          const toast: Toaster = {
            type: 'success',
            message: 'Order updated successfully!',
            title: 'Order Updated:',
          };
          this.toastService.showToaster(toast);
          this.router.navigate(['/primaryOrders', this.status]);
        } else {
          const toast: Toaster = {
            type: 'error',
            message: res.message,
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
        this.saving = false;
      },
      (error) => {
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot save order. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
          this.saving = false;
        }
      }
    );
  }

  //#endregion
}
