import { Injectable } from '@angular/core';
import { Toaster, ToasterService } from 'src/app/core/services/toaster.service';

@Injectable()
export class DataService {
  constructor(private toastService: ToasterService) {}

  calculateUnitPrice(unitPurchased: number, perUnitPrice: number): number {
    return unitPurchased * perUnitPrice;
  }

  calculateItemsBill(prices: Array<number>): number {
    let bill = 0;
    prices.forEach((price) => {
      bill += price;
    });
    return bill;
  }

  calculateDiscount(discount: number, type: string, total: number): number {
    if (type === 'percentage') {
      return (discount / 100) * total;
    } else if (type === 'price') {
      return total - discount;
    }
  }

  /** Schemes Calculation and implementation */

  getSchemes(
    itemId: number,
    unitId: number,
    prefId: number,
    schemes: Array<any>,
    retailerType: number,
    retailerId: number
  ): Array<any> {
    const productSchemes = schemes.filter((scheme) => {
      let isRetailerEligible = false;
      scheme.assignment.filter((assigned) => {
        if (
          assigned.retailer_type_id === retailerType &&
          !assigned.except_retailers.includes(retailerId)
        ) {
          isRetailerEligible = true;
          return assigned;
        }
      });
      let productFound = [];
      if (isRetailerEligible) {
        productFound = scheme.items.filter((item) => {
          if (
            item.item_id === itemId &&
            item.unit_id === unitId &&
            item.pref_id === +prefId
          ) {
            return item;
          }
        });
      }
      if (productFound.length) {
        return scheme;
      }
    });
    return productSchemes;
  }

  applyFreeProductScheme(product: any): any {
    let productWithScheme: any = {};
    switch (product.selectedScheme.scheme_rule) {
      case 1:
        productWithScheme = this.applyFPDOTP(product);
        break;
      case 2:
        productWithScheme = this.applyFPHalfQtyDiscount(product);
        break;
      case 3:
        productWithScheme = this.applyFPMinQtyRestriction(product);
        break;
      case 4:
        productWithScheme = this.applyFPIncludeandMinQtyrestriction(product);
        break;

      default:
        productWithScheme = product;
        break;
    }
    return productWithScheme;
  }

  applyFPDOTP(product: any): any {
    const discounted = this.getSDForFPTradePriceScheme(
      product.item_trade_price,
      product.stockQty,
      product.selectedScheme.min_qty,
      product.selectedScheme.quantity_free
    );
    product.scheme_discount = discounted.schemeDiscount;
    product.price = discounted.singleItemPrice;
    product.unit_price_after_scheme_discount = discounted.singleItemPrice;
    product.selectedScheme.applied = true;
    return product;
  }

  applyFPHalfQtyDiscount(product: any): any {
    if (
      this.isHalfQuantityEligible(
        product.stockQty,
        product.selectedScheme.min_qty
      )
    ) {
      const discounted = this.getSDForFPHalfQtyDiscount(
        product.item_trade_price,
        product.stockQty,
        product.selectedScheme.min_qty,
        product.selectedScheme.quantity_free
      );
      product.scheme_discount = discounted.schemeDiscount;
      product.price = discounted.singleItemPrice;
      product.unit_price_after_scheme_discount = discounted.singleItemPrice;
      product.selectedScheme.applied = true;
    } else {
      product.selectedScheme.applied = false;
      product.scheme_discount = 0;
      product.price = product.item_trade_price;
      product.unit_price_after_scheme_discount = product.item_trade_price;
      this.schemeCannotApplied();
    }
    return product;
  }

  applyFPMinQtyRestriction(product: any): void {
    if (
      this.isEligibleForMinimumQuantity(
        product.stockQty,
        product.selectedScheme.min_qty
      )
    ) {
      const discounted = this.getSDForFPQtyRestrictionDiscount(
        product.item_trade_price,
        product.stockQty,
        product.selectedScheme.min_qty,
        product.selectedScheme.quantity_free
      );
      product.scheme_discount = discounted.schemeDiscount;
      product.price = discounted.singleItemPrice;
      product.unit_price_after_scheme_discount = discounted.singleItemPrice;
      product.selectedScheme.applied = true;
    } else {
      product.selectedScheme.applied = false;
      product.scheme_discount = 0;
      product.price = product.item_trade_price;
      product.unit_price_after_scheme_discount = product.item_trade_price;
      this.schemeCannotApplied();
    }
    return product;
  }
  applyFPIncludeandMinQtyrestriction(product: any): void {
    if (
      this.isEligibleForMinimumQuantity(
        product.stockQty,
        product.selectedScheme.min_qty
      )
    ) {
      const discounted = this.getSDForFPQtyRestrictionDiscount(
        product.item_trade_price,
        product.stockQty,
        product.selectedScheme.min_qty,
        product.selectedScheme.quantity_free
      );
      product.scheme_discount = discounted.schemeDiscount;
      product.price = discounted.singleItemPrice;
      product.unit_price_after_scheme_discount = discounted.singleItemPrice;
      product.selectedScheme.applied = true;
    } else {
      product.selectedScheme.applied = false;
      product.scheme_discount = 0;
      product.price = product.item_trade_price;
      product.unit_price_after_scheme_discount = product.item_trade_price;
      this.schemeCannotApplied();
    }
    return product;
  }

  getSchemeAmount(itemTP: number, minQty: number, freeQty: number): number {
    const totalTpMinQty = itemTP * minQty;
    const totalItemBeingGiven = freeQty + minQty;
    const discountOnEachItem = totalTpMinQty / totalItemBeingGiven;
    const schemeAmount = itemTP - discountOnEachItem;
    return schemeAmount;
  }

  /**
   * Get the total scheme discount to be applied on the item selected
   * @param itemTradePrice trade price of the item
   * @param userQty quantity added by the distributor
   * @param minimumQty Minimum quantity of the scheme to be applied, added by Admin
   * @param freeQty Free quantity of the scheme to be applied, added by Admin
   * @returns Total calculated discount of the scheme
   */
  getSDForFPTradePriceScheme(
    itemTradePrice: number,
    userQty: number,
    minimumQty: number,
    freeQty: number
  ): { singleItemPrice: number; schemeDiscount: number } {
    const schemeAmount = this.getSchemeAmount(
      itemTradePrice,
      minimumQty,
      freeQty
    );
    const tradePriceForSingleItem = itemTradePrice - schemeAmount;
    return {
      singleItemPrice: tradePriceForSingleItem,
      schemeDiscount: schemeAmount,
    };
  }

  /**
   * Check if the Half Quantity Discount is applicable on the given quantity
   * @param userQty Quantity added by the Distributor
   * @param minimumQty of the scheme to be applied, added by Admin
   * @returns true/false i.e. whether Half Quantity Discount is applicable or not
   */
  isHalfQuantityEligible(userQty: number, minimumQty: number): boolean {
    const eligibleQty = Math.floor(minimumQty / 2);
    return userQty > eligibleQty;
  }

  /**
   * Get the total scheme discount to be applied on the item selected
   * @param itemTradePrice trade price of the item
   * @param userQty quantity added by the distributor
   * @param minimumQty Minimum quantity of the scheme to be applied, added by Admin
   * @param freeQty Free quantity of the scheme to be applied, added by Admin
   * @returns Total calculated discount of the scheme
   */
  getSDForFPHalfQtyDiscount(
    itemTradePrice: number,
    userQty: number,
    minimumQty: number,
    freeQty: number
  ): { singleItemPrice: number; schemeDiscount: number } {
    const freeQtyInterval = Math.floor(userQty / minimumQty);
    const orderFreeQty = freeQtyInterval * freeQty;
    const schemeAmount = this.getSchemeAmount(
      itemTradePrice,
      minimumQty,
      orderFreeQty
    );
    const singItemPrice = itemTradePrice - schemeAmount;
    return { singleItemPrice: singItemPrice, schemeDiscount: schemeAmount };
  }

  /**
   * Check if the Minimum Quantity Restriction Discount is applicable on the given quantity
   * @param userQty Quantity added by the Distributor
   * @param minimumQty of the scheme to be applied, added by Admin
   * @returns true/false i.e. whether Minimum Quantity Restriction Discount is applicable or not
   */
  isEligibleForMinimumQuantity(userQty: number, minimumQty: number): boolean {
    return +userQty >= minimumQty;
  }

  getSDForFPQtyRestrictionDiscount(
    itemTradePrice: number,
    userQty: number,
    minimumQty: number,
    freeQty: number
  ): { singleItemPrice: number; schemeDiscount: number } {
    // const freeQtyInterval = Math.floor(userQty / minimumQty);
    // const orderFreeQty = freeQtyInterval * freeQty;
    const schemeAmount = this.getSchemeAmount(
      itemTradePrice,
      minimumQty,
      freeQty
    );
    const singleItemPrice = itemTradePrice - schemeAmount;
    return { singleItemPrice, schemeDiscount: schemeAmount };
  }

  getSDForDOTP(product: any): any {
    if (
      this.isEligibleForMinimumQuantity(
        product.stockQty,
        product.selectedScheme.min_qty
      )
    ) {
      // const percentageDiscount = (product.selectedScheme.discount_on_tp / product.parent_trade_price) * 100;
      // const singleUnitDiscount = this.calculateDiscount(percentageDiscount, 'percentage', product.item_trade_price);
      //   product.price =
      //     product.item_trade_price - product.selectedScheme.discount_on_tp;
      //   product.unit_price_after_scheme_discount =
      //     product.item_trade_price - product.selectedScheme.discount_on_tp;
      //   product.scheme_discount = product.selectedScheme.discount_on_tp;

      // added freeProduct included with free prod must include scheme
      //  (enteredStockQty/schemeMinQty) * scheme_free_Qty
      product.scheme_quantity_free = this.calculateFreeQuantityToAttach(
        product.stockQty,
        product.selectedScheme.min_qty,
        product.selectedScheme.quantity_free
      );
      product.selectedScheme.applied = true;
    } else {
      product.selectedScheme.applied = false;
      product.price = product.item_trade_price;
      product.unit_price_after_scheme_discount = product.item_trade_price;
      product.scheme_discount = 0;
      product.scheme_quantity_free = 0;
      this.schemeCannotApplied();
    }
    return product;
  }
  calculateFreeQuantityToAttach(
    enteredQty: number,
    schemeMinQty: number,
    schemeFreeQty: number
  ): number {
    return parseInt((enteredQty / schemeMinQty).toString()) * schemeFreeQty;
  }

  getSDForGift(product: any): any {
    if (
      this.isEligibleForMinimumQuantity(
        product.stockQty,
        product.selectedScheme.min_qty
      )
    ) {
      product.scheme_discount =
        product.item_trade_price -
        product.selectedScheme.gift_value / product.stockQty;
      product.gift_value = product.selectedScheme.gift_value;
      product.selectedScheme.applied = true;
    } else {
      product.selectedScheme.applied = false;
      product.price = product.item_trade_price;
      product.unit_price_after_scheme_discount = product.item_trade_price;
      product.scheme_discount = 0;
      this.schemeCannotApplied();
    }
    return product;
  }

  schemeAppliedSuccessfully(): void {
    const toast: Toaster = {
      title: 'Scheme Applied',
      message: 'Selected Scheme Applied Successfully to the product!',
      type: 'success',
    };
    this.toastService.showToaster(toast);
  }

  schemeCannotApplied(): void {
    const toast: Toaster = {
      title: 'Scheme Not Applied',
      message:
        'Selected Scheme cannot applied to the product because of minimum quantity contraints!',
      type: 'error',
    };
    this.toastService.showToaster(toast);
  }
  /** Schemes End */

  /** Merchant Discount Start */
  applyMerchantDiscountForSingleProduct(
    merchantDiscount: any,
    product: any,
    orderTotal: number
  ): any {
    let discountValuePKR = 0;
    if (+product.stockQty === 0) {
      product.trade_discount = discountValuePKR;
    } else {
      if (merchantDiscount.discount_filter === 'flat') {
        if (merchantDiscount.flat.discount_type === 'percentage') {
          discountValuePKR =
            (merchantDiscount.flat.value / 100) *
            product.unit_price_after_scheme_discount;
          product.trade_discount = merchantDiscount.flat.value;
        } else {
          discountValuePKR = merchantDiscount.flat.value;
          product.trade_discount = merchantDiscount.flat.value;
        }
      } else if (merchantDiscount.discount_filter === 'slab') {
        const currentItemsPrice =
          product.unit_price_after_scheme_discount * product.stockQty;
        const totalItemsPrice = currentItemsPrice + orderTotal;
        const selectedSlab = merchantDiscount.slab.find(
          (slb) =>
            slb.range_from &&
            slb.range_to &&
            slb.range_from <= totalItemsPrice &&
            slb.range_to >= totalItemsPrice
        );
        if (selectedSlab) {
          discountValuePKR =
            (selectedSlab.value / 100) *
            product.unit_price_after_scheme_discount;
          product.trade_discount = selectedSlab.value;
        } else {
          product.trade_discount = 0;
        }
      }
    }
    product.trade_discount_pkr = discountValuePKR;
    product.price = product.unit_price_after_scheme_discount - discountValuePKR;
    product.unit_price_after_merchant_discount = JSON.parse(
      JSON.stringify(product.price)
    );
    return product;
  }

  applySlabForTotal(
    product: any,
    merchantDiscount: any,
    orderTotal: number
  ): any {
    const selectedSlab = merchantDiscount.slab.find(
      (slb) =>
        slb.range_from &&
        slb.range_to &&
        slb.range_from <= orderTotal &&
        slb.range_to >= orderTotal
    );
    if (selectedSlab && +product.stockQty > 0) {
      const discountValuePKR =
        (selectedSlab.value / 100) * product.unit_price_after_scheme_discount;
      product.trade_discount = selectedSlab.value;
      product.trade_discount_pkr = discountValuePKR;
      product.price =
        product.unit_price_after_scheme_discount - discountValuePKR;
      product.unit_price_after_merchant_discount = JSON.parse(
        JSON.stringify(product.price)
      );
    } else {
      product.trade_discount = 0;
      product.trade_discount_pkr = 0;
      product.price = product.unit_price_after_scheme_discount;
      product.unit_price_after_merchant_discount = JSON.parse(
        JSON.stringify(product.price)
      );
    }
    return product;
  }

  /** Merchant Discount END */

  /** Special Discount */
  getSpecialDiscounts(
    segmentId: number,
    regionId: number,
    product: any,
    specialDiscounts: Array<any>
  ): any {
    const selectedSpecialDiscount = specialDiscounts.find(
      (x) =>
        segmentId === x.segment_id &&
        regionId === x.region_id &&
        +product.pref_id === x.pref_id
    );
    if (selectedSpecialDiscount && +product.stockQty > 0) {
      product.price =
        product.unit_price_after_merchant_discount -
        selectedSpecialDiscount.discount;
      product.unit_price_after_special_discount =
        product.unit_price_after_merchant_discount -
        selectedSpecialDiscount.discount;
      product.special_discount = selectedSpecialDiscount.discount;
      product.special_discount_pkr = selectedSpecialDiscount.discount;
    } else {
      product.special_discount = 0;
      product.special_discount_pkr = 0.0;
      product.special_discount = 0.0;
      product.unit_price_after_special_discount = JSON.parse(
        JSON.stringify(product.unit_price_after_merchant_discount)
      );
    }
    return product;
  }
  /** Special Discount End */

  getParentQty(qty: number, childQtyInParent: number): number {
    return qty / childQtyInParent;
  }

  convertStockToUnits(
    totalQty: number,
    childQtyInParent: number
  ): { parentQty: number; childQty: number } {
    const parentQty = this.getParentQty(totalQty, childQtyInParent);
    const childQty = totalQty % childQtyInParent;
    return { parentQty, childQty };
  }

  getChildQty(qty: number, childQtyInParent: number): number {
    return qty * childQtyInParent;
  }

  isNumber(event: KeyboardEvent, type: string = 'charges'): boolean {
    if (
      (event.key && event.key.includes('ArrowLeft')) ||
      event.key.includes('ArrowRight') ||
      event.key.includes('Backspace') ||
      event.key.includes('Delete') ||
      (type === 'charges' && event.key.includes('.'))
    ) {
      return true;
    } else if (event.key && event.key.trim() === '') {
      return false;
    }
    return !isNaN(Number(event.key.trim()));
  }
}
