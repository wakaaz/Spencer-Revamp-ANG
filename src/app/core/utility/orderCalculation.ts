import {
  FREE_PRODUCT_RULES,
  SCHEME_RULES,
} from '../constants/schemes.constant';

class Utility {
  // @param tradePrice => 1 quanity Price
  // @param totalQuanity => total item qty
  public static calGrossAmount(
    tradePrice: number,
    totalQuanity: number
  ): number {
    return tradePrice * totalQuanity;
  }
  public static calTradeOfferPrice(
    schemeType: string,
    schemeMinQty: number,
    schemeFreeQty: number,
    totalBookedQuantity: number,
    schemeDiscountAmount: number,
    schemeRuleName: string,
    grossPrice: number,
    tradePrice: number
  ): number {
    let schemeDiscountedAmount: number;
    switch (schemeType) {
      case SCHEME_RULES.DOTP:
        schemeDiscountedAmount = this.applyDOTPScheme(
          schemeMinQty,
          totalBookedQuantity,
          schemeDiscountAmount
        );
        break;
      case SCHEME_RULES.FREE_PRODUCT:
        switch (schemeRuleName) {
          case FREE_PRODUCT_RULES.DISCOUNT_ON_TRADE_PRICE:
            schemeDiscountedAmount = this.applyFreeProductDiscountOnTradePrice(
              schemeMinQty,
              schemeFreeQty,
              grossPrice,
              tradePrice,
              totalBookedQuantity
            );
            break;
          case FREE_PRODUCT_RULES.DISCOUNT_ON_HALF_QUANTITY:
            schemeDiscountedAmount =
              this.applyFreeProductDiscountOnHalfQuantity(
                schemeMinQty,
                schemeFreeQty,
                tradePrice,
                totalBookedQuantity
              );
            break;
          case FREE_PRODUCT_RULES.DISCOUNT_ON_MINIMUM_QUANTITY_RESTRICTION:
            schemeDiscountedAmount =
              this.applyFreeProductDiscountOnMinQuantityRes(
                schemeMinQty,
                schemeFreeQty,
                tradePrice,
                totalBookedQuantity
              );
            break;
          case FREE_PRODUCT_RULES.FREE_PRODUCTS:
            schemeDiscountedAmount =
              this.applyFreeProductMustProdDiscountOnMinQuantity(
                schemeMinQty,
                schemeFreeQty,
                totalBookedQuantity
              );
            break;
          default:
            break;
        }
      default:
        break;
    }
    return schemeDiscountedAmount;
  }
  static applyFreeProductMustProdDiscountOnMinQuantity(
    schemeMinQty: number,
    schemeFreeQty: number,
    totalBookedQuantity: number
  ): number {
    const schemeAbleQuantity: number = parseInt(
      (totalBookedQuantity / schemeMinQty).toString()
    );
    return this.multiply(schemeFreeQty, schemeAbleQuantity);
  }

  // Discount on minimumQuantityRestriction
  static applyFreeProductDiscountOnMinQuantityRes(
    schemeMinQty: number,
    schemeFreeQty: number,
    tradePrice: number,
    totalBookedQuantity: number
  ): number {
    const discountOnUnitQty: number = this.getDiscountOnUnitQty(
      tradePrice,
      schemeMinQty,
      schemeFreeQty
    );
    const discountableQty: number =
      schemeMinQty * parseInt((totalBookedQuantity / schemeMinQty).toString());
    const schemeDiscountAmount = this.multiply(
      discountOnUnitQty,
      discountableQty
    );
    return schemeDiscountAmount;
  }

  // only apply to multiples of minSchemeQty/2
  static applyFreeProductDiscountOnHalfQuantity(
    schemeMinQty: number,
    schemeFreeQty: number,
    tradePrice: number,
    totalBookedQuantity: number
  ): number {
    const discountOnUnitQty: number = this.getDiscountOnUnitQty(
      tradePrice,
      schemeMinQty,
      schemeFreeQty
    );
    const discountOnHalfQty = schemeMinQty / 2; // half sheme Qty
    const halfDiscount = discountOnUnitQty / 2;
    const discountableQty: number =
      discountOnHalfQty *
      parseInt((totalBookedQuantity / discountOnHalfQty).toString());
    const schemeDiscountAmount = this.multiply(halfDiscount, discountableQty);
    return schemeDiscountAmount;
  }

  static applyFreeProductDiscountOnTradePrice(
    minQuantity: number,
    freeQunatity: number,
    grossPrice: number,
    tradePrice: number,
    totalBookedQuantity: number
  ): number {
    const discountOnUnitQty: number = this.getDiscountOnUnitQty(
      tradePrice,
      minQuantity,
      freeQunatity
    );
    const schemeDiscountAmount: number = this.multiply(
      discountOnUnitQty,
      totalBookedQuantity
    );
    return schemeDiscountAmount;
  }

  // calc discount on unit quantity
  private static getDiscountOnUnitQty(
    tradePrice: number,
    minQuantity: number,
    freeQunatity: number
  ): number {
    return (
      tradePrice -
      this.calGrossAmount(tradePrice, minQuantity) /
        (minQuantity + freeQunatity)
    );
  }

  // calc miultiply two values
  private static multiply(fristValue: number, secondvalue: number): number {
    return fristValue * secondvalue;
  }

  // calc trade on trade price discount
  private static applyDOTPScheme(
    schemeMinQty: number,
    totalBookedQuantity: number,
    schemeDiscountAmount: number
  ): number {
    const quanitySchemeable: number = totalBookedQuantity / schemeMinQty;
    return parseInt(quanitySchemeable.toString()) * schemeDiscountAmount;
  }

  // distributorDiscountPercentage = distributor disocunt in percentage
  public static calDistributorDiscount(
    distributorDiscountPercentage: number,
    tradePrice: number,
    totalBookedQuantity: number
  ): number {
    const unitQtyDiscount = distributorDiscountPercentage * (tradePrice / 100);
    return unitQtyDiscount * totalBookedQuantity;
  }
  // special discount = pkr
  // total quantity
  public static calSpeacialDiscount(
    specialDiscount: number,
    totalBookedQuantity: number
  ): number {
    return specialDiscount * totalBookedQuantity;
  }

  // extraOrbookerDiscount= pkr
  // total quantity
  public static calExtraOrBookerDiscount(
    extraOrbookerDiscount: number,
    totalBookedQuantity: number
  ): number {
    return extraOrbookerDiscount
      ? extraOrbookerDiscount
      : 0 * totalBookedQuantity;
  }

  // tax in percentage
  public static calTax(
    taxPercentagevalue: number,
    retailPrice: number,
    totalBookedQuantity: number
  ): number {
    const unitItemDicosunt = (taxPercentagevalue * retailPrice) / 100;
    return unitItemDicosunt * totalBookedQuantity;
  }
}

export default Utility;

// extra_discount-booker-discount => qty*booker_discount < netAmount
// net amount  => gross_amt - trade_offer - dist_disct - sp_dist - extra_booker_discount + toal_tax'
// sp_discount => sp_disc * qty
// distributor % get => (dist * (t.p)/100) * total_booked_qty
// tax_retail_price pr lagna h
// tax = ((tax* (retail_price))/100) * total_booked_qty
// trade_offer =>
