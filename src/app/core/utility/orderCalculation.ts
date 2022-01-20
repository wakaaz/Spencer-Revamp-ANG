class Utility {
  // @param tradePrice => 1 quanity Price
  // @param totalQuanity => total item qty
  public static calGrossAmount(
    tradePrice: number,
    totalQuanity: number
  ): number {
    return tradePrice * totalQuanity;
  }
  public static calTradeOfferPrice(): number {
    return 0;
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
    return extraOrbookerDiscount * totalBookedQuantity;
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
