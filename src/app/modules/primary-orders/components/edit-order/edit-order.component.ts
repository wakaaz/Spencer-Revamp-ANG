import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // orderContent: PrimaryOrderItem[];
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
  constructor(
    private actr: ActivatedRoute,
    public primarySrvc: PrimaryOrdersService,
    private toastService: ToasterService,
    private dataService: DataService
  ) {
    this.order = new PrimaryOrder();
  }

  ngOnInit(): void {
    const orderId = this.actr.snapshot.params.orderId;
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
      this.order.orderContent = this.primarySrvc.getPrimaryOrderItem([
        ...x.data.content,
      ]);
      this.getProductsMetaData();

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

  //#region on extra disount change event
  onExtraDiscountChange(index: number): void {
    // if (this.orderContent[index].booker_discount <= 0) {
    //   return;
    // }
    // const netAmmount =
    //   this.orderContent[index].booked_total_qty *
    //     this.orderContent[index].unit_price -
    //   (this.orderContent[index].scheme_id &&
    //   this.orderContent[index].scheme_id !== 0
    //     ? this.orderContent[index].booked_total_qty *
    //       ((this.orderContent[index].booked_total_qty *
    //         this.orderContent[index].unit_price) /
    //         this.orderContent[index].scheme_min_quantity +
    //         this.orderContent[index].scheme_quantity_free)
    //     : 0) -
    //   0 -
    //   ((this.orderContent[index].unit_price *
    //     this.orderContent[index].distributor_discount) /
    //     100) *
    //     this.orderContent[index].booked_total_qty -
    //   ((this.orderContent[index].unit_price *
    //     this.orderContent[index].special_discount) /
    //     100) *
    //     this.orderContent[index].booked_total_qty;
    // if (this.orderContent[index].booker_discount >= netAmmount) {
    //   this.orderContent[index].booker_discount = 0;
    // }
  }
  //#endregion

  //#region  show product list
  showProductsList(event: Event): void {
    event.stopPropagation();
    // if (true) {
    this.allProducts = this.allProducts.map((product) => {
      // product.schemes = this.primarySrvc.getSchemes(
      //   product.item_id,
      //   product.unit_id,
      //   product.pref_id,
      //   this.schemes,
      //   this.selectedRetailer?.type_id || 0,
      //   this.selectedRetailer?.id || 0
      // );
      return product;
    });
    this.dispProducts = [...this.allProducts];
    this.showProducts = true;
    document.body.classList.add('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.add('d-block');
    document.getElementById('blureEffct-1').classList.add('blur-div');
    // } else {
    //   this.toastService.showToaster({
    //     type: 'error',
    //     message: 'Please select Retailer first!',
    //     title: 'Fill required fields:',
    //   });
    // }
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
              console.log(i);
              return pr;
            });
            console.log(this.allProducts.length);
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
    // if (
    //   this.selectedProduct.selectedScheme &&
    //   !this.selectedProduct.selectedScheme.applied
    // ) {
    //   this.dataService.schemeCannotApplied();
    //   return;
    // }

    // this.isAdded = true;
    // if (+this.selectedProduct.stockQty > 0 && this.selectedProduct.pref_id) {
    //   const pr = this.selectedProducts.find(
    //     (x) =>
    //       x.item_id === this.selectedProduct.item_id &&
    //       x.pref_id === this.selectedProduct.pref_id
    //   );
    //   if (pr) {
    //     this.alreadyAdded = true;
    //   } else {
    //     this.alreadyAdded = false;
    //     this.showQuantityModal = false;
    //     this.allProducts = this.allProducts.map((prod) => {
    //       if (prod.item_id === this.selectedProduct.item_id) {
    //         prod.isAdded = true;
    //       }
    //       return prod;
    //     });
    //     this.dispProducts = this.dispProducts.map((prod) => {
    //       if (prod.item_id === this.selectedProduct.item_id) {
    //         prod.isAdded = true;
    //       }
    //       return prod;
    //     });
    //     this.selectedProduct.isAdded = true;
    //     // this.orderContent.push(
    //     //   this.getOrderContentItem({ ...this.selectedProduct })
    //     // );
    //     console.log('selc prod => ', this.selectedProduct);
    //     this.selectedProducts.push(this.selectedProduct);
    //     if (!this.selectedProductsIds.includes(this.selectedProduct.item_id)) {
    //       this.selectedProductsIds.push(this.selectedProduct.item_id);
    //     }
    //     // this.calculateTotalBill();
    //     // this.applySlabOnAllProducts();
    //     // document.getElementById('pl-qty-close').click();
    //     this.isAdded = false;
    //     // this.closeQuantityModal(event);
    //   }
    // }
  }
  //#endregion

  //#region get order content Item
  getOrderContentItem(product: any): IPrimaryOrderItem {
    // return {
    //   id: product.item_id,
    //   booked_order_value: 0,
    //   booked_total_qty: +product.stockQty,
    //   booker_discount: product.booker_discount,
    //   distributor_discount: product.distributor_discount,
    //   distributor_discount_pkr: product.distributor_discount_pkr,
    //   final_price: product.final_price,
    //   gift_value: product.gift_value,
    //   item_name: product.item_name,
    //   item_quantity_booker: product.item_quantity_booker
    //   item_quantity_updated: product.item_quantity_updated,
    //   item_retail_price: product.item_retail_price,
    //   item_sku: product.item_sku,
    //   original_price: product.original_price,
    //   parent_item_retail_price: product.parent_item_retail_price,
    //   parent_pref_id: product.parent_pref_id,
    //   parent_qty_sold: product.parent_qty_sold
    // }
    return null;
  }
  //#endregion

  //#region Remove product from order
  removeProductFromOrder(product: any): void {
    // if (this.isCreditAdded || this.isChequeAdded) {
    //   this.toastService.showToaster({
    //     title: 'Payment Error:',
    //     message:
    //       'Cannot edit or remove current products if payment method added!',
    //     type: 'error',
    //   });
    //   return;
    // }
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
    // if (!this.selectedProducts.find(x => x.item_id !== product.item_id)) {
    this.selectedProductsIds = this.selectedProductsIds.filter(
      (x) => x !== product.item_id
    );
    // }
    // this.calculateTotalBill();
    // this.applySlabOnAllProducts();
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
    console.log('selectedProduct.hasOwnProperty', this.selectedProduct.schemes);
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
      // product.parent_qty_sold = this.dataService.getParentQty(
      //   +product.stockQty,
      //   product.quantity
      // );
      // // this.calculateProductPrice(product);
      // this.calculateProductDiscounts(product);
      // this.calculateTotalBill();
      // this.applySlabOnAllProducts();
    }
    // if (this.selectedProduct.schemes.length) {
    //   for (let scheme of this.selectedProduct.schemes) {
    //     if (
    //       scheme.scheme_type === SCHEME_RULES.FREE_PRODUCT &&
    //       scheme.rule_name === freeProductsRules['4']
    //     ) {
    //       if (+product.stockQty >= scheme.min_qty) {
    //         scheme.isAvailable = true;
    //       } else {
    //         scheme.isAvailable = false;
    //       }
    //     }
    //   }
    // }
  }
  //#endregion

  //#region validatio isNumber
  isNumber(event: KeyboardEvent, type: string = 'charges'): boolean {
    return this.dataService.isNumber(event, type);
  }
  //#endregion

  //#region  calculate product discounts
  calculateProductDiscounts(product: any, scheme?: any): void {
    // Trade Offer
    if (scheme) {
      product.selectedScheme = scheme;
    }
    if (product.selectedScheme) {
      product = this.applyScheme(product);
    } else {
      product.scheme_discount = 0;
      product.price = { ...product }.item_trade_price;
      product.unit_price_after_scheme_discount = {
        ...product,
      }.item_trade_price;
    }

    // Trade Discount
    // if (this.merchantDiscount) {
    //   product = this.dataService.applyMerchantDiscountForSingleProduct(
    //     this.merchantDiscount,
    //     product,
    //     this.grossAmount
    //   );
    // } else {
    //   product.trade_discount = 0;
    //   product.trade_discount_pkr = 0;
    //   product.unit_price_after_merchant_discount = JSON.parse(
    //     JSON.stringify(product.price)
    //   );
    // }

    // Special Discount
    product = this.calculateProductSpecialDiscount(product);

    // Extra Discount => Booker Discount
    // product.extra_discount = 0;
    // product.extra_discount_pkr = 0;

    // this.calculateNetAmountOfProduct(product);
  }
  //#endregion

  //#region apply scheme
  applyScheme(product: any): any {
    switch (product.selectedScheme.scheme_type) {
      case 'free_product':
        product = this.applyFreeProductScheme(product);
        break;
      case 'dotp':
        product = this.applyDOTPScheme(product);
        break;
      default:
        product = this.applyGiftScheme(product);
        break;
    }
    return product;
  }
  //#endregion

  //#region apply free product scheme
  applyFreeProductScheme(product: any): any {
    product = this.dataService.applyFreeProductScheme(product);
    return product;
  }
  //#endregion

  //#region  apply Discount on trade price scheme
  applyDOTPScheme(product: any): any {
    return this.dataService.getSDForDOTP(product);
  }
  //#endregion

  //#region  apply gift scheme
  applyGiftScheme(product: any): any {
    return this.dataService.getSDForGift(product);
  }
  //#endregion

  //#region calculate net amount or product
  calculateNetAmountOfProduct(product: any): any {
    // product.net_amount = this.dataService.calculateUnitPrice(
    //   product.price,
    //   +product.stockQty
    // );
    // this.calculateProductTax(product);
  }
  //#endregion

  //#region  calculate product special discount
  calculateProductSpecialDiscount(product: any): any {
    // return this.dataService.getSpecialDiscounts(
    //   this.selectedSegment,
    //   this.selectedRegion,
    //   product,
    //   this.specialDiscounts
    // );
  }
  //#endregion

  //#region calculate product tax
  calculateProductTax(product: any): void {
    if (product.tax_class_amount) {
      product.tax_amount_value =
        (product.tax_class_amount / 100) * product.item_retail_price;
      product.tax_amount_pkr = product.tax_amount_value * product.stockQty;
      product.net_amount = product.net_amount + product.tax_amount_pkr;
    } else {
      product.tax_amount_value = 0;
      product.tax_amount_pkr = 0;
    }
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
}
