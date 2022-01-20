export const schemes = {
  dotp: 'Discount on Trade Price',
  free_products: 'Free Products',
  gift: 'Gift',
};

export const freeProductsRules = {
  1: 'Discount on Trade Price',
  2: 'Discount on half quantity',
  3: 'Discount on Minimum quantity restriction',
  4: 'Free products',
};

export const SCHEME_RULES = {
  FREE_PRODUCT: 'free_product',
};

/** Discount Implementation Rules For Free Products */

// 1. Discount on Trade Price
/**
 * 1. No constraint to check if the discount is applicable.
 * 2. Calculate the total trade price for the minimum quantity (i.e. TradePrice * MinimumQty => e.g. 1.72 * 5 = 8.6)
 * 3. Total items for the Scheme (i.e. MinimumQty + FreeQty => e.g. 5 + 2 = 7)
 * 4. Calculate discount (i.e. ToatalTradePriceForMinimumQty / TotalItem => e.g. 8.6/7 = 1.23)
 * 5. Trade Price for Single Item (TradePrice - discount => e.g. 1.72 - 1.23 = 0.49)
 * 6. Scheme Discount = TradePriceForSingleItem * QtyEnteredByUser
 * 7. Net Amount = TotalTradePriceItemsWithQty - SchemeDiscount
 */

// 2. Discount on Half Quantity
/**
 * 1. It has the restriction by half of the minimum quantity
 * 2. The Discount is applicable if and only if
 * the User Entered Qty is greater than the half of minimum quantity (e.g. 6/2 = 3(EligibleQty))
 * 3. Calculate the free quantity portion by dividing the UserEnteredQty over EligibleQty (e.g. 8/3 = 2.7 (get the floor) => 2)]
 * 4. Get Total Free Qty of Order by Multiplying FreeQtyPortion with scheme Free Qty (e.g. 2 * 2 = 4)
 * 5. Calculate the total trade price for the minimum quantity (i.e. TradePrice * MinimumQty => e.g. 1.72 * 6 = 10.32)
 * 6. Total items for the Scheme (i.e. MinimumQty + TotalFreeQty => e.g. 6 + 4 = 10)
 * 7. Calculate discount (i.e. ToatalTradePriceForMinimumQty / TotalItem => e.g. 10.32/10 = 1.032)
 * 8. SchemeAmount (TradePrice - discount => e.g. 1.72 - 1.032 = 0.68)
 * 9. Scheme Discount = SchemeAmount * QtyEnteredByUser
 * 10. Net Amount = TotalTradePriceItemsWithQty - SchemeDiscount
 */

// 3. Discount on Minimum Quantity Restriction
/**
 * 1. It has the restriction of minimum quantity
 * 2. The discount is applicable if and only if the user entered quantity is greater than the minimum qty of scheme
 * (i.e. UserEnterdQty > MinimumQty => e.g. 10 > 6 (apply) || 4 > 6 (reject))
 * 3. Calculate the free quantity portion by dividing the UserEnteredQty over MinimumQty (e.g. 23/6 = 3.8 (get the floor) => 3)]
 * 4. Get Total Free Qty of Order by Multiplying FreeQtyPortion with scheme Free Qty (e.g. 3 * 2 = 6)
 * 5. Calculate the total trade price for the minimum quantity (i.e. TradePrice * MinimumQty => e.g. 1.72 * 6 = 10.32)
 * 6. Total items for the Scheme (i.e. MinimumQty + TotalFreeQty => e.g. 6 + 6 = 12)
 * 7. Calculate discount (i.e. ToatalTradePriceForMinimumQty / TotalItem => e.g. 10.32/12 = 0.86)
 * 8. SchemeAmount (TradePrice - discount => e.g. 1.72 - 0.86 = 0.86)
 * 9. Scheme Discount = SchemeAmount * QtyEnteredByUser
 * 10. Net Amount = TotalTradePriceItemsWithQty - SchemeDiscount
 */

// 4. Free Products
/**
 * Need some discussion to clear free products scenario (Either the free products are going to be added in the UserEnteredQty
 * Or has to reduce the price of product for the free products).
 */

/** Discount On Trade Price */
/**
 * Check user quantity is greater than scheme mimum quantity
 * 1. Calculate the percentage value for the give discount_on_tp from the biggest unit of the selected product
 * 2. Calculate the scheme discount value from the percentage obtained to selected unit of the product
 */

/** Gift */
/**
 * Check user quantity is greater than scheme mimum quantity
 * 1. Calculate the scheme discount by deducting the gift_value from the totalItemPrice
 * i.e. disoucnt = item_trade_price * userQty - gift_value;
 */
