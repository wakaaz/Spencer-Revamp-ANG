import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/app/core/constants/api-urls.constants';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { OrdersService } from '../../services/orders.service';
import {
  Toaster,
  ToasterService,
} from '../../../../core/services/toaster.service';
import { DataService } from '../../../shared/services/data.service';
import { LocalStorageService } from 'src/app/core/services/storage.service';
import {
  freeProductsRules,
  schemes,
} from 'src/app/core/constants/schemes.constant';
import { CounterSale, PaymentDetail } from '../../models/counter-sale.model';
import { OrderItem } from '../../models/order-item.model';
import { GeneralDataService } from '../../../shared/services';

@Component({
  selector: 'app-counter-sale',
  templateUrl: './counter-sale.component.html',
  styleUrls: ['./counter-sale.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CounterSaleComponent implements OnInit {
  showProducts: boolean;
  showQuantityModal: boolean;
  isCredit: boolean;
  loadingProducts: boolean;
  isOrdering: boolean;
  isAdded: boolean;
  alreadyFullPayment: boolean;
  isChequeAdded: boolean;
  isCreditAdded: boolean;
  alreadyAdded: boolean;

  grossAmount: number;
  tradeOffer: number;
  tradeDiscount: number;
  specialDiscount: number;
  extraDiscount: number;
  tax: number;
  dueAmount: number;
  selectedEmployee: number;
  selectedRoute: number;
  selectedRegion: number;
  selectedSegment: number;
  distributorId: number;
  selectedProductQuantities: number;
  chequeAmount: number;
  creditAmount: number;
  orderTotal: number;
  totalAmountAfterScheme: number;
  totalRetailPrice: number;

  chequeNumber: string;
  paymentDate: string;
  paymentTypeCheque: string;
  paymentTypeCredit: string;
  bankName: string;
  productSearchText: string;
  notes: string;
  addedPayment: string;
  currentPayment: string;

  selectedProduct: any = {};
  merchantDiscount: any;
  selectedRetailer: any;
  cheque: PaymentDetail;
  credit: PaymentDetail;
  cash: PaymentDetail;
  order: CounterSale;

  schemeItemIds: Array<number> = [];
  allProducts: Array<any> = [];
  dispProducts: Array<any> = [];
  specialDiscounts: Array<any> = [];
  prefrences: Array<any> = [];
  orderBookers: Array<any> = [];
  routes: Array<any> = [];
  retailers: Array<any> = [];
  selectedProducts: Array<any> = [];
  selectedProductsIds: Array<any> = [];
  schemes: Array<any> = [];
  subInventory: Array<any> = [];
  discountSlabs: Array<any> = [];

  constructor(
    private router: Router,
    private generalDataService: GeneralDataService,
    private storageService: LocalStorageService,
    private ordersService: OrdersService,
    private toastService: ToasterService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.grossAmount = 0.0;
    this.tradeOffer = 0.0;
    this.tradeDiscount = 0.0;
    this.specialDiscount = 0.0;
    this.extraDiscount = 0.0;
    this.tax = 0.0;
    this.dueAmount = 0.0;
    this.totalAmountAfterScheme = 0.0;
    this.notes = '';
    this.paymentDate = new Date().toISOString().split('T')[0];
    this.paymentTypeCheque = '';
    this.paymentTypeCredit = '';
    this.addedPayment = '';
    this.currentPayment = '';
    this.getSchemesData();
    this.getOrderBookers();
    this.getCounterSaleData();
  }

  getOrderBookers(): void {
    this.distributorId = this.storageService.getItem('distributor').id;
    this.generalDataService.getOrderBookers(this.distributorId).subscribe(
      (res) => {
        if (res.status === 200) {
          this.orderBookers = res.data;
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
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot fetch order bookers. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }

  getCounterSaleData(): void {
    this.loadingProducts = true;
    this.ordersService.getCounterSaleData().subscribe(
      (res: any) => {
        this.loadingProducts = false;
        if (res.status === 200) {
          this.allProducts = res.data.inventory.map((pr) => {
            pr.net_amount = 0.0;
            pr.isAdded = false;
            return pr;
          });
          this.specialDiscounts = res.data.special_discount;
          // this.prefrences = res.data.prefs;
          this.dispProducts = JSON.parse(JSON.stringify(this.allProducts));
          this.subInventory = res.data.sub_inventory;
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

  resetValues(): void {
    this.selectedProducts = [];
    this.selectedProductsIds = [];
    this.grossAmount = 0.0;
    this.tradeOffer = 0.0;
    this.tradeDiscount = 0.0;
    this.specialDiscount = 0.0;
    this.extraDiscount = 0.0;
    this.credit = null;
    this.cheque = null;
    this.cash = null;
    this.tax = 0.0;
    this.dueAmount = 0.0;
    this.notes = '';
    this.paymentDate = new Date().toISOString().split('T')[0];
    this.paymentTypeCheque = '';
    this.paymentTypeCredit = '';
    this.addedPayment = '';
    this.allProducts = this.allProducts.map((pr) => {
      pr.isAdded = false;
      return pr;
    });
    this.dispProducts = JSON.parse(JSON.stringify(this.allProducts));
  }

  getSchemesData(): void {
    this.ordersService.getSchemes().subscribe(
      (res) => {
        if (res.status === 200) {
          this.schemes = res.data;
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
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot fetch Trade Offers. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }

  getDiscountSlabs(): void {
    this.selectedSegment = this.selectedRetailer.segment_id;
    this.resetValues();
    this.ordersService.getDiscountSlabs().subscribe(
      (res) => {
        if (res.status === 200) {
          this.discountSlabs = res.data;
          this.merchantDiscount = this.discountSlabs.find(
            (x) =>
              x.region_id === this.selectedRegion &&
              this.selectedSegment === x.segment_id &&
              x.channel_id === this.selectedRetailer.type_id
          );
        }
      },
      (error) => {
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot fetch Trade Discount. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }

  focused(event: Event): void {
    (event.target as HTMLElement).parentElement.classList.add('focused');
  }

  left(event: Event): void {
    if (!(event.target as HTMLInputElement).value) {
      (event.target as HTMLElement).parentElement.classList.remove('focused');
    }
  }

  isFullyPaymentAdded(current: string): void {
    if (current === 'Credit') {
      this.paymentTypeCredit = '';
    } else {
      this.paymentTypeCheque = '';
    }
    if (this.selectedProducts.length === 0 && this.dueAmount === 0.0) {
      const toast: Toaster = {
        type: 'error',
        message: `Please select products first!`,
        title: `Payment cannot be added`,
      };
      this.toastService.showToaster(toast);
    } else {
      if (
        (this.paymentTypeCheque === 'full' ||
          this.paymentTypeCredit === 'full') &&
        this.addedPayment !== current
      ) {
        const toast: Toaster = {
          type: 'error',
          message: `You already selected Full payment for ${this.addedPayment} please remove it if you want to add ${this.currentPayment}!`,
          title: `Full Payment selected for ${this.addedPayment}`,
        };
        this.toastService.showToaster(toast);
      } else {
        document.getElementById('open-modal-payment').click();
        this.focusForPaymentValues();
      }
    }
  }

  focusForPaymentValues(): void {
    if (this.isCredit && this.creditAmount) {
      document.getElementById('Amount2').parentElement.classList.add('focused');
    } else {
      if (this.chequeAmount) {
        document
          .getElementById('Amount1')
          .parentElement.classList.add('focused');
      }
      if (this.bankName) {
        document
          .getElementById('chequeBankName')
          .parentElement.classList.add('focused');
      }
      if (this.chequeNumber) {
        document
          .getElementById('chequeNum')
          .parentElement.classList.add('focused');
      }
    }
  }

  currentFullPayment(current: string, other: string): void {
    if (
      (this.paymentTypeCheque === 'full' ||
        this.paymentTypeCredit === 'full') &&
      this.addedPayment !== current
    ) {
      const toast: Toaster = {
        type: 'error',
        message: `You already selected Full payment for ${this.addedPayment} please remove it if you want to add ${this.currentPayment}!`,
        title: `Full Payment selected for ${this.addedPayment}`,
      };
      this.toastService.showToaster(toast);
    } else {
      this.addedPayment = current;
      this.currentPayment = other;
    }
  }

  setPartial(current: string): void {
    if (current === this.addedPayment) {
      if (this.credit && current === 'Credit') {
        this.cash.amount_received =
          this.cash.amount_received + this.credit.amount_received;
        this.credit.amount_received = 0;
      }
      if (this.cheque && current === 'Cheque Payment') {
        this.cash.amount_received =
          this.cash.amount_received + this.cheque.amount_received;
        this.cheque.amount_received = 0;
      }
      this.addedPayment = '';
      this.currentPayment = '';
      this.alreadyFullPayment = false;
    }
  }

  checkPaymentHasValues(): boolean {
    if (this.isCredit) {
      if (this.paymentTypeCredit === 'full') {
        return this.paymentTypeCredit.length > 0;
      } else {
        return (
          this.paymentTypeCredit.length > 0 &&
          this.creditAmount &&
          this.creditAmount > -1 &&
          this.creditAmount <= this.cash.amount_received
        );
      }
    } else {
      if (this.paymentTypeCheque === 'full') {
        return (
          this.paymentTypeCheque.length > 0 &&
          this.bankName.length > 0 &&
          this.chequeNumber.length > 0 &&
          this.paymentDate.length > 0
        );
      } else {
        return (
          this.paymentTypeCheque.length > 0 &&
          this.chequeAmount &&
          this.chequeAmount > -1 &&
          this.chequeAmount <= this.cash.amount_received &&
          this.bankName.length > 0 &&
          this.chequeNumber.length > 0 &&
          this.paymentDate.length > 0
        );
      }
    }
  }

  removeCheque(): void {
    this.cheque = null;
    this.isChequeAdded = false;
    this.paymentTypeCheque = '';
    this.calculatePayments();
  }

  removeCredit(): void {
    this.credit = null;
    this.isCreditAdded = false;
    this.paymentTypeCredit = '';
    this.calculatePayments();
  }

  makePayment(): void {
    if (this.isCredit) {
      this.credit = {
        retailer_id: this.selectedRetailer.retailer_id,
        distributor_id: this.distributorId,
        type: 'Counter',
        payment_mode: 'Credit',
        payment_detail: '',
        dispatched_bill_amount: 0,
        recovery: 0,
        amount_received:
          this.paymentTypeCredit === 'full'
            ? JSON.parse(JSON.stringify(this.dueAmount))
            : JSON.parse(JSON.stringify(this.creditAmount)),
      };
      this.isCreditAdded = true;
    }
    if (!this.isCredit) {
      this.cheque = {
        retailer_id: this.selectedRetailer.retailer_id,
        distributor_id: this.distributorId,
        type: 'Counter',
        payment_mode: 'Cheque',
        payment_detail: {
          cheque_amount:
            this.paymentTypeCheque === 'full'
              ? JSON.parse(JSON.stringify(this.dueAmount))
              : JSON.parse(JSON.stringify(this.chequeAmount)),
          bank_name: JSON.parse(JSON.stringify(this.bankName)),
          cheque_number: JSON.parse(JSON.stringify(this.chequeNumber)),
          cheque_date: JSON.parse(JSON.stringify(this.paymentDate)),
        },
        dispatched_bill_amount: 0,
        recovery: 0,
        amount_received:
          this.paymentTypeCheque === 'full'
            ? JSON.parse(JSON.stringify(this.dueAmount))
            : JSON.parse(JSON.stringify(this.chequeAmount)),
      };
      this.isChequeAdded = true;
    }
    this.calculatePayments();
  }

  addPaymentMethod(): void {
    this.isAdded = true;
    const isPaymentAdded = this.checkPaymentHasValues();
    if (isPaymentAdded) {
      this.isAdded = false;
      this.makePayment();
      document.getElementById('open-modal-payment').click();
    }
  }

  paymentCancelled(): void {
    this.isAdded = false;
    this.resetPaymentValues();
    this.paymentTypeCredit = '';
    this.paymentTypeCheque = '';
  }

  resetPaymentValues(): void {
    this.chequeAmount = null;
    this.paymentDate = new Date().toISOString().split('T')[0];
    this.bankName = '';
    this.chequeNumber = null;
    this.creditAmount = null;
  }

  getRoutes(): void {
    const employee = this.orderBookers.find(
      (x) => x.employee_id === this.selectedEmployee
    );
    this.selectedRegion = employee.region_id;
    this.selectedRoute = null;
    this.selectedRetailer = null;
    this.resetValues();
    this.generalDataService
      .getOrderBookerRoutes(this.selectedEmployee)
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.routes = res.data;
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
          if (error.status !== 1 && error.status !== 401) {
            const toast: Toaster = {
              type: 'error',
              message: 'Cannot fetch order booker routes. Please try again',
              title: 'Error:',
            };
            this.toastService.showToaster(toast);
          }
        }
      );
  }

  getRetailerByRoute(): void {
    this.selectedRetailer = null;
    this.resetValues();
    this.generalDataService.getRetailersByRoute(this.selectedRoute).subscribe(
      (res) => {
        if (res.status === 200) {
          this.retailers = res.data;
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
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Cannot fetch retailers. Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }

  openQuantityModal(product: any): void {
    this.showQuantityModal = true;
    if (product.schemes?.length) {
      product.schemes = product.schemes.map((scheme) => {
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
    this.selectedProduct = JSON.parse(JSON.stringify(product));
    this.selectedProduct.selectedScheme = null;
    // this.selectedProduct.units = this.prefrences.filter(x => x.item_id === product.item_id);
  }

  showProductsList(event: Event): void {
    event.stopPropagation();
    if (true) {
      this.allProducts = this.allProducts.map((product) => {
        product.schemes = this.dataService.getSchemes(
          product.item_id,
          product.unit_id,
          product.pref_id,
          this.schemes,
          this.selectedRetailer?.type_id || 0,
          this.selectedRetailer?.id || 0
        );
        return product;
      });
      this.dispProducts = JSON.parse(JSON.stringify(this.allProducts));
      this.showProducts = true;
      document.body.classList.add('no-scroll');
      document
        .getElementsByClassName('overlay-blure')[0]
        .classList.add('d-block');
      document.getElementById('counter-sale').classList.add('blur-div');
    } else {
      this.toastService.showToaster({
        type: 'error',
        message: 'Please select Retailer first!',
        title: 'Fill required fields:',
      });
    }
  }

  // setPrefrence(prefId: number, product: any): void {
  //     this.alreadyAdded = false;
  //     const prefrence = this.prefrences.find(x => x.pref_id === +prefId);
  //     product.unit_id = prefrence.unit_id;
  //     product.item_trade_price = prefrence.item_trade_price;
  //     product.unit_name = prefrence.unit_name;
  //     product.retail_price = prefrence.item_retail_price;
  //     if (product.stockQty) {
  //         if (this.selectedProducts.find(x => x.item_id === product.item_id && x.pref_id === product.pref_id)) {
  //             this.grossAmount = this.grossAmount - product.original_amount;
  //         }
  //         this.calculateProductDiscounts(product);
  //         this.calculateProductPrice(product);
  //         this.calculateTotalBill();
  //         this.applySlabOnAllProducts();
  //     }
  // }

  isNumber(event: KeyboardEvent, type: string = 'charges'): boolean {
    return this.dataService.isNumber(event, type);
  }

  setQuantity(product: any): void {
    if (+product.stockQty > 1000) {
      product.stockQty = 0;
    }
    if (product.item_trade_price) {
      if (this.selectedProducts.find((x) => x.item_id === product.item_id)) {
        this.grossAmount = this.grossAmount - product.original_amount || 0;
      }
      product.parent_qty_sold = this.dataService.getParentQty(
        +product.stockQty,
        product.quantity
      );
      this.calculateProductPrice(product);
      this.calculateProductDiscounts(product);
      this.calculateTotalBill();
      this.applySlabOnAllProducts();
    }
  }

  calculateProductPrice(product): void {
    product.original_amount = this.dataService.calculateUnitPrice(
      +product.stockQty,
      product.item_trade_price
    );
    product.gross_amount =
      product.unit_price_after_scheme_discount ||
      product.item_trade_price * +product.stockQty;
  }

  applySlabOnAllProducts(): void {
    if (
      this.merchantDiscount &&
      this.merchantDiscount.discount_filter === 'slab' &&
      this.grossAmount
    ) {
      this.selectedProducts = this.selectedProducts.map((product) => {
        product = this.dataService.applySlabForTotal(
          product,
          this.merchantDiscount,
          this.grossAmount
        );
        product = this.calculateProductSpecialDiscount(product);
        if (product.extra_discount) {
          product.price =
            product.unit_price_after_special_discount - +product.extra_discount;
        }
        this.calculateNetAmountOfProduct(product);
        return product;
      });
      this.calculateTotalBill();
    }
  }

  addProductToOrder(): void {
    if (
      this.selectedProduct.selectedScheme &&
      !this.selectedProduct.selectedScheme.applied
    ) {
      this.dataService.schemeCannotApplied();
      return;
    }
    this.isAdded = true;
    if (+this.selectedProduct.stockQty > 0 && this.selectedProduct.pref_id) {
      const pr = this.selectedProducts.find(
        (x) =>
          x.item_id === this.selectedProduct.item_id &&
          x.pref_id === this.selectedProduct.pref_id
      );
      if (pr) {
        this.alreadyAdded = true;
      } else {
        this.alreadyAdded = false;
        this.showQuantityModal = false;
        this.allProducts = this.allProducts.map((prod) => {
          if (prod.item_id === this.selectedProduct.item_id) {
            prod.isAdded = true;
          }
          return prod;
        });
        this.dispProducts = this.dispProducts.map((prod) => {
          if (prod.item_id === this.selectedProduct.item_id) {
            prod.isAdded = true;
          }
          return prod;
        });
        this.selectedProduct.isAdded = true;
        this.selectedProducts.push(this.selectedProduct);
        if (!this.selectedProductsIds.includes(this.selectedProduct.item_id)) {
          this.selectedProductsIds.push(this.selectedProduct.item_id);
        }
        this.calculateTotalBill();
        this.applySlabOnAllProducts();
        document.getElementById('pl-qty-close').click();
        this.isAdded = false;
      }
    }
  }

  removeProductFromOrder(product: any): void {
    if (this.isCreditAdded || this.isChequeAdded) {
      this.toastService.showToaster({
        title: 'Payment Error:',
        message:
          'Cannot edit or remove current products if payment method added!',
        type: 'error',
      });
      return;
    }
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
    this.calculateTotalBill();
    this.applySlabOnAllProducts();
  }

  calculateProductDiscounts(product: any, scheme?: any): void {
    // Trade Offer
    if (scheme) {
      product.selectedScheme = scheme;
    }
    if (product.selectedScheme) {
      product = this.applyScheme(product);
    } else {
      product.scheme_discount = 0;
      product.price = JSON.parse(JSON.stringify(product.item_trade_price));
      product.unit_price_after_scheme_discount = JSON.parse(
        JSON.stringify(product.item_trade_price)
      );
    }

    // Trade Discount
    if (this.merchantDiscount) {
      product = this.dataService.applyMerchantDiscountForSingleProduct(
        this.merchantDiscount,
        product,
        this.grossAmount
      );
    } else {
      product.trade_discount = 0;
      product.trade_discount_pkr = 0;
      product.unit_price_after_merchant_discount = JSON.parse(
        JSON.stringify(product.price)
      );
    }

    // Special Discount
    product = this.calculateProductSpecialDiscount(product);

    // Extra Discount => Booker Discount
    product.extra_discount = 0;
    product.extra_discount_pkr = 0;

    this.calculateNetAmountOfProduct(product);
  }

  calculateProductSpecialDiscount(product: any): any {
    return this.dataService.getSpecialDiscounts(
      this.selectedSegment,
      this.selectedRegion,
      product,
      this.specialDiscounts
    );
  }

  calculateExtraDiscount(product: any): void {
    if (+product.extra_discount < product.unit_price_after_special_discount) {
      product.price =
        product.unit_price_after_special_discount - +product.extra_discount;
      product.extra_discount_pkr = +product.stockQty * +product.extra_discount;
    } else {
      product.extra_discount = 0;
      product.extra_discount_pkr = 0;
      product.price = product.unit_price_after_special_discount;
      const toast: Toaster = {
        type: 'error',
        message: 'Discount should not be greater than item price!',
        title: 'Error:',
      };
      this.toastService.showToaster(toast);
    }
    this.calculateNetAmountOfProduct(product);
    this.calculateTotalBill();
  }

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

  calculateNetAmountOfProduct(product: any): any {
    product.net_amount = this.dataService.calculateUnitPrice(
      product.price,
      +product.stockQty
    );
    this.calculateProductTax(product);
  }

  calculateTotalBill(): void {
    if (this.selectedProducts.length) {
      this.selectedProductQuantities = this.selectedProducts
        .map((product) => +product.parent_qty_sold)
        .reduce((a, b) => a + b);
    }
    // Gross Amount
    let prices = this.selectedProducts.map(
      (product) => product.original_amount
    );
    this.grossAmount = this.dataService.calculateItemsBill(prices);
    // Retail Price
    prices = this.selectedProducts.map(
      (product) => product.stockQty * product.item_retail_price
    );
    this.totalRetailPrice = this.dataService.calculateItemsBill(prices);
    // Gross Amount
    prices = this.selectedProducts.map((product) => product.gross_amount);
    this.totalAmountAfterScheme = this.dataService.calculateItemsBill(prices);
    // Net Amount
    prices = this.selectedProducts.map((product) => product.net_amount);
    this.dueAmount = this.dataService.calculateItemsBill(prices);
    // Order Original
    prices = this.selectedProducts.map((product) => product.original_amount);
    this.orderTotal = JSON.parse(JSON.stringify(this.dueAmount));
    // Scheme Discount
    let discount = this.selectedProducts.map(
      (product) => +product.stockQty * product.scheme_discount
    );
    this.tradeOffer = this.dataService.calculateItemsBill(discount);
    // Trade Discount
    discount = this.selectedProducts.map(
      (product) => +product.stockQty * product.trade_discount_pkr
    );
    this.tradeDiscount = this.dataService.calculateItemsBill(discount);
    // Special Discount
    discount = this.selectedProducts.map(
      (product) => +product.stockQty * product.special_discount_pkr
    );
    this.specialDiscount = this.dataService.calculateItemsBill(discount);
    // Extra Discount
    discount = this.selectedProducts.map(
      (product) => +product.extra_discount_pkr
    );
    this.extraDiscount = this.dataService.calculateItemsBill(discount);
    // Tax
    const taxes = this.selectedProducts.map(
      (product) => product.tax_amount_pkr
    );
    this.tax = this.dataService.calculateItemsBill(taxes);

    this.calculatePayments();
  }

  calculatePayments(): void {
    this.cash = {
      retailer_id: this.selectedRetailer.retailer_id,
      distributor_id: this.distributorId,
      type: 'Counter',
      payment_mode: 'Cash',
      payment_detail: '',
      dispatched_bill_amount: 0,
      recovery: 0,
      amount_received: this.dueAmount,
    };
    if (this.cheque) {
      this.cash.amount_received =
        this.cash.amount_received - this.cheque.amount_received;
    }
    if (this.credit) {
      this.cash.amount_received =
        this.cash.amount_received - this.credit.amount_received;
    }
    this.cash.amount_received = +this.cash.amount_received.toFixed(2);
  }

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

  applyFreeProductScheme(product: any): any {
    product = this.dataService.applyFreeProductScheme(product);
    return product;
  }

  applyDOTPScheme(product: any): any {
    return this.dataService.getSDForDOTP(product);
  }

  applyGiftScheme(product: any): any {
    return this.dataService.getSDForGift(product);
  }

  closeQuantityModal(event: Event): void {
    if (
      this.showQuantityModal &&
      !(event.target as HTMLElement).classList.contains('dont-close-quantity')
    ) {
      this.showQuantityModal = false;
      this.selectedProduct = JSON.parse(JSON.stringify({}));
    }
  }

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

  isAlreadyAdded(itemId: number): boolean {
    return this.selectedProductsIds.includes(itemId);
  }

  clickedOutSide(event: Event): void {
    if (
      this.showProducts &&
      !this.showQuantityModal &&
      !(event.target as HTMLElement).classList.contains('dont-close-products')
    ) {
      this.closeProductsList();
    }
  }

  closeProductsList(): void {
    this.showProducts = false;
    document.body.classList.remove('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.remove('d-block');
    document.getElementById('counter-sale').classList.remove('blur-div');
  }

  isDataValid(): boolean {
    if (
      !this.selectedProductsIds.length ||
      (!this.selectedEmployee && !this.selectedRoute) ||
      !this.selectedRetailer
    ) {
      return false;
    } else {
      return true;
    }
  }

  setOrderFields(): void {
    if (!this.isDataValid()) {
      const toast: Toaster = {
        type: 'error',
        message:
          'Please select Employee, Route, Retailer and Products to place the order!',
        title: 'Error:',
      };
      this.toastService.showToaster(toast);
    } else {
      const employee = this.orderBookers.find(
        (x) => x.employee_id === this.selectedEmployee
      );
      const newOrder: CounterSale = {
        area_id: employee.area_id,
        assigned_route_id: this.selectedRoute,
        booking_territory: employee.territory_id,
        order_type: 'counter',
        counter_sale: 1,
        spot_sale: 0,
        sales_man_id: 0,
        within_radius: 0,
        booking_region: this.selectedRegion,
        invoice_number: '',
        invoice_date: new Date().toISOString(),
        remarks: this.notes,
        retailer_id: this.selectedRetailer.retailer_id,
        distributor_id: this.distributorId,
        gross_sale_amount: this.grossAmount,
        total_amount_after_tax: this.dueAmount,
        total_discount:
          this.specialDiscount +
          this.tradeDiscount +
          this.tradeOffer +
          this.extraDiscount,
        total_tax_amount: this.tax,
        booked_order_value: 0,
        booked_total_qty: 0,
        booked_total_skus: 0,
        booking_area: employee.area_id,
        booking_locality_id: this.selectedRetailer.locality_id,
        booking_neighbourhood_id: this.selectedRetailer.neighbourhood_id,
        booking_zone: employee.area_id,
        employee_id: employee.employee_id,
        freight_charges: 0,
        order_total: this.orderTotal,
        region_id: this.selectedRegion,
        status: 'Completed',
        status_code: 0,
        territory_id: employee.territory_id,
        total_retail_price: this.totalRetailPrice,
        ttl_products_sold: this.selectedProductsIds.length,
        ttl_qty_sold: this.selectedProductQuantities,
        payment: {
          total_payment: this.dueAmount,
          detail: [],
        },
        items: [],
      };
      this.order = newOrder;
      if (this.cheque) {
        this.order.payment.detail.push(this.cheque);
      }
      if (this.credit) {
        this.order.payment.detail.push(this.credit);
      }
      this.order.payment.detail.push(this.cash);
      this.setOrderItems(employee);
    }
  }

  setOrderItems(selectedEmployee: any): void {
    this.selectedProducts.forEach((product, index) => {
      const productTotalDiscount =
        +product.stockQty * product.scheme_discount +
        +product.stockQty * product.trade_discount_pkr +
        +product.stockQty * product.special_discount +
        product.extra_discount_pkr;
      const item: OrderItem = {
        item_id: product.item_id,
        pref_id: product.pref_id,
        unit_id: product.unit_id,
        item_name: product.item_name,
        unit_name: product.unit_name,
        item_quantity_booker: 0,
        quantity_returned: 0,
        area_id: selectedEmployee.area_id,
        division_id: selectedEmployee.division_id,
        assigned_route_id: this.selectedRoute,
        booked_total_qty: 0,
        quantity: +product.stockQty,
        gross_sale_amount: product.original_amount,
        booked_order_value: 0,
        brand_id: product.brand_id,
        campaign_id: product.selectedScheme?.id || 0,
        dispatch_status: 0,
        distributor_id: this.distributorId,
        final_price: product.net_amount,
        gift_value: product.gift_value || 0,
        item_quantity_updated: 0,
        item_status: product.is_active,
        order_id: 0,
        original_price: product.item_trade_price,
        scheme_id: product.selectedScheme?.id || 0,
        scheme_discount: product.scheme_discount,
        unit_price_after_scheme_discount:
          product.unit_price_after_scheme_discount,
        merchant_discount_pkr: product.trade_discount_pkr,
        merchant_discount: product.trade_discount,
        unit_price_after_merchant_discount:
          product.unit_price_after_merchant_discount,
        special_discount: product.special_discount,
        unit_price_after_special_discount:
          product.unit_price_after_special_discount,
        booker_discount: product.extra_discount,
        unit_price_after_individual_discount:
          product.unit_price_after_individual_discount || product.price,
        scheme_min_quantity: product.selectedScheme?.min_qty || 0,
        scheme_quantity_free: product.selectedScheme?.quantity_free || 0,
        scheme_rule: product.selectedScheme?.rule_name || '',
        parent_pref_id: product.child,
        parent_unit_id: product.parent_unit_id,
        parent_brand_id: product.brand_id,
        parent_tp: product.parent_trade_price,
        reasoning: '',
        region_id: this.selectedRegion,
        territory_id: selectedEmployee.territory_id,
        parent_qty_sold: product.parent_qty_sold,
        parent_value_sold: product.net_amount,
        tax_class_id: product.tax_class_id,
        tax_in_percentage: product.tax_class_amount,
        tax_in_value: product.tax_amount_value,
        total_amount_after_tax: product.net_amount,
        total_discount: productTotalDiscount,
        total_retail_price: product.stockQty * product.item_retail_price,
        total_tax_amount: product.tax_amount_pkr || 0,
      };
      this.order.items.push(item);
      if (index === this.selectedProducts.length - 1) {
        this.placeOrder();
      }
    });
  }

  openBillsModal() {
    (
      document.getElementById(
        'billsPrintPaperModalTrigger'
      ) as HTMLButtonElement
    ).click();
  }

  getBills(size: string = 'A4'): void {
    document.getElementById('close-bills').click();
    const billsUrl = `${environment.apiDomain}${
      API_URLS.BILLS
    }?type=bill&order_booker=${
      this.order.employee_id
    }&date=${this.order.invoice_date.substring(0, 10)}&size=${size}&orderID=${
      this.order['id']
    }`;
    window.open(billsUrl, '_blank');
  }

  placeOrder(): void {
    this.isOrdering = true;
    this.ordersService.counterSaleOrder(this.order).subscribe(
      (res) => {
        this.isOrdering = false;
        if (res.status === 200) {
          this.order['id'] = res.data.id;
          this.openBillsModal();

          const toast: Toaster = {
            type: 'success',
            message: 'Order Placed successfully!',
            title: 'Order Placed:',
          };
          this.toastService.showToaster(toast);
          this.selectedEmployee = null;
          this.selectedRoute = null;
          this.selectedRetailer = null;
          this.credit = null;
          this.cheque = null;
          this.cash = null;
          this.retailers = [];
          this.routes = [];
          this.isChequeAdded = false;
          this.isCreditAdded = false;
          this.resetValues();
          this.paymentCancelled();
        }
      },
      (error) => {
        this.isOrdering = false;
        if (error.status !== 1 && error.status !== 401) {
          const toast: Toaster = {
            type: 'error',
            message: 'Order cannot be placed at the moment! Please try again',
            title: 'Error:',
          };
          this.toastService.showToaster(toast);
        }
      }
    );
  }
}
