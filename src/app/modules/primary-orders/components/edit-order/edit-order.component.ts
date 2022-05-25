import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { EMPTY, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/storage.service';
import { localStorageKeys } from 'src/app/core/constants/localstorage.constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit, OnDestroy {
  //#region Fields and Construct on int
  BASE_URL = environment.apiDomain;
  subscriptions: Subscription[] = [];
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
  isNew: boolean;
  distributor: any;
  subDistributor: any;
  selectedSubDistributor: number;
  subDistributors: any[];
  isReturn = false;
  title: string;
  showEditFields = false;

  constructor(
    @Inject(LocalStorageService) private storageService: LocalStorageService,
    private actr: ActivatedRoute,
    public primarySrvc: PrimaryOrdersService,
    private toastService: ToasterService,
    private dataService: DataService,
    private router: Router
  ) {
    this.order = new PrimaryOrder();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.distributor = this.storageService.getItem(
      localStorageKeys.distributor
    );
    const orderId = this.actr.snapshot.params.orderId;
    this.showEditFields = orderId > 0 ? true : false;
    this.status = this.actr.snapshot.params.status;
    this.getProductsMetaData();
    this.isReturn = this.actr.snapshot.params.new === 'return' ? true : false;

    this.isNewOrder();
    if (this.isNew) {
      this.loading = true;
      this.getOrderbyOrderId(orderId);
    }
    this.title = this.isNew ? 'Edit' : 'Create';
    if (this.isReturn) {
      this.title = 'Return';
    }
    if (!this.isNew || this.isReturn) {
      this.getDistributorsEmployees(this.distributor.id);
    }
  }
  getDistributorsEmployees(id: number) {
    const sub = this.primarySrvc.getSubDistributors().subscribe((emp) => {
      this.subDistributors = emp.data;
    });
    this.subscriptions.push(sub);
  }

  isNewOrder() {
    this.isNew = this.actr.snapshot.params.new !== 'new' ? true : false;
  }

  correctIamgeURL() {
    this.allProducts.forEach((x) => {
      const urlArray = x.thumbnail.split('/');
      if (urlArray[0] === 'https:') {
        x.thumbnail =
          this.BASE_URL + '/' + x.thumbnail.split('/').splice(3).join('/');
      } else {
        x.thumbnail = this.BASE_URL + '/' + x.thumbnail;
      }
    });
  }
  onSubDistributorChanged(): void {
    this.subDistributor = this.subDistributors.find(
      (x) => x.id === this.selectedSubDistributor
    );
  }

  //#region get order by orderId
  getOrderbyOrderId(orderId: number) {
    const sub = this.primarySrvc
      .getOderDetailById(orderId)
      .subscribe((x: any) => {
        const orderRes = { ...x.data.order };
        this.order.distributor_name = orderRes.distributor_name;
        this.order.employee_name = orderRes.employee_name;
        this.order.date = orderRes.date;
        this.order.id = orderRes.id;
        this.order.frieght_price = orderRes.frieght_price;
        this.order.orderContent = this.primarySrvc.getPrimaryOrderItem([
          ...x.data.content,
        ]);
        this.loading = false;
      });
    this.subscriptions.push(sub);
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
    const sub = this.primarySrvc.getProductsMetaData().subscribe(
      (res: any) => {
        if (res.status === 200) {
          if (this.showEditFields) {
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
          } else {
            this.allProducts = res.data.inventory.map((pr) => {
              pr.isAdded = false;
              pr.net_amount = 0.0;
              return pr;
            });
          }
          this.correctIamgeURL();
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

    this.subscriptions.push(sub);
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
    if (!this.order.orderContent && !this.isNew) {
      this.order.orderContent = new Array<PrimaryOrderItem>();
    }
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
    if (this.showEditFields) {
      this.primarySrvc.updateOrder(this.order).subscribe(
        (res) => {
          if (res.status === 200) {
            const toast: Toaster = {
              type: 'success',
              message: 'Order updated successfully!',
              title: 'Order Updated:',
            };
            this.toastService.showToaster(toast);
            this.router.navigate(['/primaryOrders/booked']);
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
    } else {
      if (
        this.selectedSubDistributor &&
        this.order.orderContent &&
        this.order.orderContent?.length
      ) {
        this.order.distributor_id = this.selectedSubDistributor;
        this.order.employee_id = this.subDistributor.tsm_id;
        // TODO: fields needs to be remove from order model too
        // this.order.status = 'completed';
        // this.order.booker_lats = 0;
        // this.order.booker_longs = 0;
        // this.order.within_radius = 0;
        // this.order.phone_order = 1;
        // this.order.offline_order = 0;
        // this.order.created_at = new Date();
        this.primarySrvc
          .saveOrReturnOrder(this.order, this.distributor.id, this.isReturn)
          .subscribe(
            (res) => {
              if (res.status === 200) {
                const toast: Toaster = {
                  type: 'success',
                  message: 'Order created successfully!',
                  title: 'Order Created:',
                };
                this.toastService.showToaster(toast);
                this.router.navigate(['/primaryOrders/booked']);
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
      } else if (!this.selectedSubDistributor) {
        const toast: Toaster = {
          type: 'error',
          message: 'Please select sub distributor',
          title: 'Error:',
        };
        this.toastService.showToaster(toast);
        this.saving = false;
      } else if (!this.order.orderContent?.length) {
        const toast: Toaster = {
          type: 'error',
          message: 'Please add atleast one product',
          title: 'Error:',
        };
        this.toastService.showToaster(toast);
        this.saving = false;
      }
    }
  }

  //#endregion
}
