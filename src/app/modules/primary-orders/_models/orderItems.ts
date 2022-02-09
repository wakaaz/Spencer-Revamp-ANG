import {
  freeProductsRules,
  FREE_PRODUCT_RULES,
  SCHEME_RULES,
} from 'src/app/core/constants/schemes.constant';
import Utility from 'src/app/core/utility/orderCalculation';
import { IorderItems } from './commonOrderItems';

export interface IPrimaryOrderItem extends IorderItems {
  id: number;
  item_name: string;
  item_quantity_updated: number; // updated
  item_sku: string;
  product_image: number;
  special_discount_pkr: number;
  tax_amount: number; // %
  unit_name: string;
}

//#region set primnaryorderItem from get order by Id
export function setPrimarOrderItem(
  primaryOrderItem: IPrimaryOrderItem
): PrimaryOrderItem {
  const primOrderItem = new PrimaryOrderItem();
  primOrderItem.id = primaryOrderItem.id;
  primOrderItem.brand_id = primaryOrderItem.brand_id;
  primOrderItem.parent_unit_quantity =
    primaryOrderItem.item_quantity_booker / primaryOrderItem.parent_qty_sold;
  primOrderItem.booked_order_value = primaryOrderItem.booked_order_value;
  primOrderItem.booked_total_qty = primaryOrderItem.booked_total_qty;
  primOrderItem.booker_discount = primaryOrderItem.booker_discount; // booker discount amount pkr
  primOrderItem.distributor_discount = primaryOrderItem.distributor_discount; // %
  primOrderItem.distributor_discount_pkr =
    primaryOrderItem.distributor_discount_pkr;
  primOrderItem.final_price = primaryOrderItem.final_price;
  primOrderItem.gift_value = primaryOrderItem.gift_value;
  primOrderItem.item_id = primaryOrderItem.item_id;
  primOrderItem.item_name = primaryOrderItem.item_name;
  primOrderItem.item_quantity_booker = primaryOrderItem.item_quantity_booker; // current
  primOrderItem.item_quantity_updated = primaryOrderItem.item_quantity_updated; // updated
  primOrderItem.item_retail_price = primaryOrderItem.item_retail_price;
  primOrderItem.item_sku = primaryOrderItem.item_sku;
  primOrderItem.original_price = primaryOrderItem.original_price;
  primOrderItem.parent_item_retail_price =
    primaryOrderItem.parent_item_retail_price;
  primOrderItem.parent_pref_id = primaryOrderItem.parent_pref_id;
  primOrderItem.parent_qty_sold = primaryOrderItem.parent_qty_sold; // show parent
  primOrderItem.parent_tp = primaryOrderItem.parent_tp; // one qty ammount
  primOrderItem.parent_unit_id = primaryOrderItem.parent_unit_id;
  primOrderItem.pref_id = primaryOrderItem.pref_id;
  primOrderItem.product_image = primaryOrderItem.product_image;
  primOrderItem.scheme_discount = primaryOrderItem.scheme_discount;
  primOrderItem.scheme_id = primaryOrderItem.scheme_id;
  primOrderItem.scheme_min_quantity = primaryOrderItem.scheme_min_quantity;
  primOrderItem.scheme_quantity_free = primaryOrderItem.scheme_quantity_free;
  primOrderItem.scheme_rule = primaryOrderItem.scheme_rule;
  primOrderItem.scheme_type = primaryOrderItem.scheme_type;
  primOrderItem.special_discount = primaryOrderItem.special_discount; // amount pkr
  primOrderItem.special_discount_pkr = primaryOrderItem.special_discount || 0;
  primOrderItem.tax_amount = primaryOrderItem.tax_amount; // %
  primOrderItem.tax_class_id = primaryOrderItem.tax_class_id;
  primOrderItem.tax_in_value = primaryOrderItem.tax_in_value;
  primOrderItem.total_discount = primaryOrderItem.total_discount;
  primOrderItem.total_retail_price = primaryOrderItem.total_retail_price;
  primOrderItem.total_tax_amount = primaryOrderItem.total_tax_amount;
  primOrderItem.unit_id = primaryOrderItem.unit_id;
  primOrderItem.unit_name = primaryOrderItem.unit_name;
  primOrderItem.unit_price = primaryOrderItem.unit_price;
  primOrderItem.scheme_discount_on_tp = primaryOrderItem.scheme_discount;
  // primOrderItem.unit_price_after_booker_discount =
  //   primaryOrderItem.unit_price_after_booker_discount;
  // primOrderItem.unit_price_after_distributor_discount =
  //   primaryOrderItem.unit_price_after_distributor_discount;
  // primOrderItem.unit_price_after_scheme_discount =
  //   primaryOrderItem.unit_price_after_scheme_discount;
  // primOrderItem.unit_price_after_special_discount =
  //   primaryOrderItem.unit_price_after_special_discount;

  return primOrderItem;
}

//#endregion
// TODO:CODE CLEAN
export function getNewPrimaryOderItem(selectedProduct: any): PrimaryOrderItem {
  const primOrderItem = new PrimaryOrderItem();
  primOrderItem.brand_id = selectedProduct.brand_id;
  primOrderItem.parent_unit_quantity = selectedProduct.parent.quantity;
  // primOrderItem.division_id = selectedProduct.division_id; TODO: Maybe Addedd
  primOrderItem.scheme_discount = selectedProduct.scheme_discount;
  // primOrderItem.selectedScheme = selectedProduct.selectedScheme; TODO: slected scheme when add prodcut
  // primOrderItem.dispatch_status = selectedProduct.dispatch_status;
  // primOrderItem.dispatch_qty = selectedProduct.dispatch_qty;
  // primOrderItem.dispatch_amount = selectedProduct.dispatch_amount;
  // primOrderItem.executed_qty = selectedProduct.executed_qty;
  // primOrderItem.executed_amount = selectedProduct.executed_amount;
  // // primOrderItem.id = selectedProduct.id;
  // primOrderItem.booked_order_value = selectedProduct.booked_order_value;
  // primOrderItem.booked_total_qty = selectedProduct.booked_total_qty;
  primOrderItem.booker_discount = 0; // booker discount amount pkr
  primOrderItem.distributor_discount = selectedProduct.dist_discount; // %
  // primOrderItem.distributor_discount_pkr =
  //   selectedProduct.distributor_discount_pkr;
  // primOrderItem.final_price = selectedProduct.final_price;
  primOrderItem.item_id = selectedProduct.item_id;
  primOrderItem.item_name = selectedProduct.item_name;
  // primOrderItem.item_quantity_booker = selectedProduct.item_quantity_booker; // current
  // primOrderItem.item_quantity_updated = selectedProduct.item_quantity_updated; // updated
  primOrderItem.item_retail_price = selectedProduct.item_retail_price;
  primOrderItem.item_sku = selectedProduct.item_sku;
  primOrderItem.original_price = selectedProduct.parent.item_trade_price;
  // primOrderItem.parent_item_retail_price =
  //   selectedProduct.parent_item_retail_price;
  primOrderItem.parent_pref_id = selectedProduct.parent.id;
  primOrderItem.parent_qty_sold = selectedProduct.stockQty; // show parent
  primOrderItem.parent_tp = selectedProduct.item_trade_price; // one qty ammount
  primOrderItem.parent_unit_id = selectedProduct.parent.unit_id;
  primOrderItem.pref_id = selectedProduct.pref_id;
  if (selectedProduct.selectedScheme) {
    // primOrderItem.product_image = selectedProduct.product_image;
    // primOrderItem.scheme_discount = selectedProduct.scheme_discount;
    primOrderItem.scheme_id = selectedProduct.selectedScheme.id;
    primOrderItem.scheme_discount_on_tp =
      selectedProduct.selectedScheme.discount_on_tp;
    primOrderItem.scheme_min_quantity = selectedProduct.selectedScheme.min_qty;
    primOrderItem.scheme_quantity_free =
      selectedProduct.selectedScheme.quantity_free;
    primOrderItem.scheme_rule = selectedProduct.selectedScheme.scheme_rule;
    primOrderItem.rule_name = selectedProduct.selectedScheme.rule_name;
    primOrderItem.scheme_type = selectedProduct.selectedScheme.scheme_type;
    primOrderItem.gift_value = selectedProduct.selectedScheme.gift_value;
  }
  primOrderItem.special_discount = selectedProduct.spec_discount; // amount pkr
  // primOrderItem.special_discount_pkr = selectedProduct.special_discount_pkr;
  primOrderItem.tax_amount = selectedProduct.tax_amount; // %
  primOrderItem.tax_class_id = selectedProduct.tax_class_id;
  // primOrderItem.tax_in_value = selectedProduct.tax_in_value;
  // primOrderItem.total_discount = selectedProduct.total_discount;
  // primOrderItem.total_retail_price = selectedProduct.total_retail_price;
  // primOrderItem.total_tax_amount = selectedProduct.total_tax_amount;
  primOrderItem.unit_id = selectedProduct.unit_id;
  primOrderItem.unit_name = selectedProduct.unit_name;
  primOrderItem.unit_price = selectedProduct.parent.item_trade_price;
  // primOrderItem.unit_price_after_booker_discount =
  //   selectedProduct.unit_price_after_booker_discount;
  // primOrderItem.unit_price_after_distributor_discount =
  //   selectedProduct.unit_price_after_distributor_discount;
  // primOrderItem.unit_price_after_special_discount =
  //   selectedProduct.unit_price_after_special_discount;

  return primOrderItem;
}
export class PrimaryOrderItem implements IPrimaryOrderItem {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }
  //#region  only getter calculated fields

  public get grossPrice(): number {
    return Utility.calGrossAmount(this.parent_tp, this.parent_qty_sold);
  }
  public get tradeOffer(): number {
    if (this.scheme_id && this.rule_name !== FREE_PRODUCT_RULES.FREE_PRODUCTS) {
      return Utility.calTradeOfferPrice(
        this.scheme_type,
        this.scheme_min_quantity,
        this._scheme_quantity_free,
        this.parent_qty_sold,
        this.scheme_discount_on_tp,
        this.rule_name,
        this.grossPrice,
        this.parent_tp
      );
    } else {
      return 0;
    }
  }

  public get schemeFreeProdsCount(): number {
    if (this.scheme_id && this.rule_name === FREE_PRODUCT_RULES.FREE_PRODUCTS) {
      return Utility.calTradeOfferPrice(
        this.scheme_type,
        this.scheme_min_quantity,
        this._scheme_quantity_free,
        this.parent_qty_sold,
        this.scheme_discount_on_tp,
        this.rule_name,
        this.grossPrice,
        this.parent_tp
      );
    } else {
      return 0;
    }
  }

  public get distributorDiscount(): number {
    return Utility.calDistributorDiscount(
      this.distributor_discount,
      this.parent_tp,
      this.parent_qty_sold
    );
  }

  public get specialDiscount(): number {
    return Utility.calSpeacialDiscount(
      this.special_discount,
      this.parent_qty_sold
    );
  }

  // booker discount and extra discount are the same in this project
  public get extraDiscount(): number {
    return Utility.calExtraOrBookerDiscount(
      this.booker_discount,
      this.parent_qty_sold
    );
  }
  public get tax(): number {
    return Utility.calTax(
      this.tax_amount,
      this.item_retail_price,
      this.parent_qty_sold
    );
  }

  public get totalBill(): number {
    return (
      this.grossPrice -
      this.tradeOffer -
      this.distributorDiscount -
      this.specialDiscount -
      this.extraDiscount +
      this.tax
    );
  }
  public get totalBillWithoutExtraDisocunt(): number {
    return (
      this.grossPrice -
      this.tradeOffer -
      this.distributorDiscount -
      this.specialDiscount +
      this.tax
    );
  }
  private _maxBookerDiscount: number;
  public get maxBookerDiscount(): number {
    return this._maxBookerDiscount;
  }
  public set maxBookerDiscount(v: number) {
    this._maxBookerDiscount = v;
  }
  //#endregion

  private _parent_unit_quantity: number;
  public get parent_unit_quantity(): number {
    return this._parent_unit_quantity;
  }
  public set parent_unit_quantity(v: number) {
    this._parent_unit_quantity = v;
  }

  private _brand_id: number;
  public get brand_id(): number {
    return this._brand_id;
  }
  public set brand_id(v: number) {
    this._brand_id = v || null;
  }

  private _parent_value_sold: number;
  public get parent_value_sold(): number {
    return this._parent_value_sold;
  }
  public set parent_value_sold(v: number) {
    this._parent_value_sold = v || null;
  }

  private _booked_order_value: number;
  public get booked_order_value(): number {
    return this._booked_order_value;
  }
  public set booked_order_value(v: number) {
    this._booked_order_value = v;
  }

  private _booked_total_qty: number;
  public get booked_total_qty(): number {
    return this._booked_total_qty;
  }
  public set booked_total_qty(v: number) {
    this._booked_total_qty = v;
  }

  private _booker_discount: number;
  public get booker_discount(): number {
    return this._booker_discount;
  }
  public set booker_discount(v: number) {
    this._booker_discount = v || 0;
  }

  private _distributor_discount: number;
  public get distributor_discount(): number {
    return this._distributor_discount;
  }
  public set distributor_discount(v: number) {
    this._distributor_discount = v;
  }

  private _distributor_discount_pkr: number;
  public get distributor_discount_pkr(): number {
    return this._distributor_discount_pkr;
  }
  public set distributor_discount_pkr(v: number) {
    this._distributor_discount_pkr = v;
  }

  private _final_price: number;
  public get final_price(): number {
    return this._final_price;
  }
  public set final_price(v: number) {
    this._final_price = v;
  }

  private _gift_value: number;
  public get gift_value(): number {
    return this._gift_value;
  }
  public set gift_value(v: number) {
    this._gift_value = v || 0;
  }

  private _item_id: number;
  public get item_id(): number {
    return this._item_id;
  }
  public set item_id(v: number) {
    this._item_id = v;
  }

  private _item_name: string;
  public get item_name(): string {
    return this._item_name;
  }
  public set item_name(v: string) {
    this._item_name = v;
  }

  private _item_quantity_booker: number;
  public get item_quantity_booker(): number {
    return this._item_quantity_booker;
  }
  public set item_quantity_booker(v: number) {
    this._item_quantity_booker = v;
  }

  private _item_quantity_updated: number;
  public get item_quantity_updated(): number {
    return this._item_quantity_updated;
  }
  public set item_quantity_updated(v: number) {
    this._item_quantity_updated = v;
  }

  private _item_retail_price: number;
  public get item_retail_price(): number {
    return this._item_retail_price;
  }
  public set item_retail_price(v: number) {
    this._item_retail_price = v;
  }

  private _item_sku: string;
  public get item_sku(): string {
    return this._item_sku;
  }
  public set item_sku(v: string) {
    this._item_sku = v;
  }

  private _original_price: number;
  public get original_price(): number {
    return this._original_price;
  }
  public set original_price(v: number) {
    this._original_price = v;
  }

  private _parent_item_retail_price: number;
  public get parent_item_retail_price(): number {
    return this._parent_item_retail_price;
  }
  public set parent_item_retail_price(v: number) {
    this._parent_item_retail_price = v;
  }

  private _parent_pref_id: number;
  public get parent_pref_id(): number {
    return this._parent_pref_id;
  }
  public set parent_pref_id(v: number) {
    this._parent_pref_id = v;
  }

  private _parent_qty_sold: number;
  public get parent_qty_sold(): number {
    return this._parent_qty_sold;
  }
  public set parent_qty_sold(v: number) {
    this._parent_qty_sold = v;
    this.maxBookerDiscount =
      this.totalBillWithoutExtraDisocunt / this.parent_qty_sold;
  }

  private _parent_tp: number;
  public get parent_tp(): number {
    return this._parent_tp;
  }
  public set parent_tp(v: number) {
    this._parent_tp = v;
  }

  private _parent_unit_id: number;
  public get parent_unit_id(): number {
    return this._parent_unit_id;
  }
  public set parent_unit_id(v: number) {
    this._parent_unit_id = v;
  }

  private _pref_id: number;
  public get pref_id(): number {
    return this._pref_id;
  }
  public set pref_id(v: number) {
    this._pref_id = v;
  }

  private _product_image: number;
  public get product_image(): number {
    return this._product_image;
  }
  public set product_image(v: number) {
    this._product_image = v;
  }

  private _scheme_discount: number;
  public get scheme_discount(): number {
    return this._scheme_discount;
  }
  public set scheme_discount(v: number) {
    this._scheme_discount = v;
  }

  private _scheme_id: number;
  public get scheme_id(): number {
    return this._scheme_id;
  }
  public set scheme_id(v: number) {
    this._scheme_id = v || 0;
  }

  private _scheme_discount_on_tp: number;
  public get scheme_discount_on_tp(): number {
    return this._scheme_discount_on_tp;
  }
  public set scheme_discount_on_tp(v: number) {
    this._scheme_discount_on_tp = v || 0;
  }

  private _scheme_min_quantity: number;
  public get scheme_min_quantity(): number {
    return this._scheme_min_quantity || 0;
  }
  public set scheme_min_quantity(v: number) {
    this._scheme_min_quantity = v || 0;
  }

  private _scheme_quantity_free: number;
  public get scheme_quantity_free(): number {
    return this._scheme_quantity_free;
  }
  public set scheme_quantity_free(v: number) {
    this._scheme_quantity_free = v || 0;
  }

  private _scheme_rule: number;
  public get scheme_rule(): number {
    return this._scheme_rule;
  }
  public set scheme_rule(v: number) {
    this._scheme_rule = v || 0;
  }

  private _rule_name: string;
  public get rule_name(): string {
    return freeProductsRules[`${this.scheme_rule}`];
  }
  public set rule_name(v: string) {
    this._rule_name = v;
  }

  private _scheme_type: string;
  public get scheme_type(): string {
    return this._scheme_type;
  }
  public set scheme_type(v: string) {
    this._scheme_type = v || '0';
  }

  private _special_discount: number;
  public get special_discount(): number {
    return this._special_discount;
  }
  public set special_discount(v: number) {
    this._special_discount = v;
  }

  private _special_discount_pkr: number;
  public get special_discount_pkr(): number {
    return this._special_discount_pkr;
  }
  public set special_discount_pkr(v: number) {
    this._special_discount_pkr = v;
  }

  private _tax_amount: number;
  public get tax_amount(): number {
    return this._tax_amount;
  }
  public set tax_amount(v: number) {
    this._tax_amount = v;
  }

  private _tax_class_id: number;
  public get tax_class_id(): number {
    return this._tax_class_id;
  }
  public set tax_class_id(v: number) {
    this._tax_class_id = v;
  }

  private _tax_in_value: number;
  public get tax_in_value(): number {
    return this._tax_in_value;
  }
  public set tax_in_value(v: number) {
    this._tax_in_value = v;
  }

  private _total_discount: number;
  public get total_discount(): number {
    return this._total_discount;
  }
  public set total_discount(v: number) {
    this._total_discount = v;
  }

  private _total_retail_price: number;
  public get total_retail_price(): number {
    return this._total_retail_price;
  }
  public set total_retail_price(v: number) {
    this._total_retail_price = v;
  }

  private _total_tax_amount: number;
  public get total_tax_amount(): number {
    return this._total_tax_amount;
  }
  public set total_tax_amount(v: number) {
    this._total_tax_amount = v;
  }

  private _unit_id: number;
  public get unit_id(): number {
    return this._unit_id;
  }
  public set unit_id(v: number) {
    this._unit_id = v;
  }

  private _unit_name: string;
  public get unit_name(): string {
    return this._unit_name;
  }
  public set unit_name(v: string) {
    this._unit_name = v;
  }

  private _unit_price: number;
  public get unit_price(): number {
    return this._unit_price;
  }
  public set unit_price(v: number) {
    this._unit_price = v;
  }

  public get unit_price_after_booker_discount(): number {
    return (this.grossPrice - this.extraDiscount) / this.parent_qty_sold;
  }

  public get unit_price_after_distributor_discount(): number {
    return (this.grossPrice - this.distributorDiscount) / this.parent_qty_sold;
  }
  public get unit_price_after_scheme_discount(): number {
    return (this.grossPrice - this.tradeOffer) / this.parent_qty_sold;
  }

  public get unit_price_after_special_discount(): number {
    return (this.grossPrice - this.specialDiscount) / this.parent_qty_sold;
  }

  public get allDiscounts(): number {
    return this.tradeOffer + this.distributorDiscount + this.extraDiscount;
  }

  public get totalRetailPrice(): number {
    return this.item_retail_price * this.parent_qty_sold;
  }

  public get quantity(): number {
    return this.parent_unit_quantity * this.parent_qty_sold;
  }
}

export const setPrimaryOrderItemAPI = (item: IPrimaryOrderItem) => {
  const primaryOrderItem: IPrimaryOrderItem = {
    id: item.id,
    brand_id: item.brand_id,
    booked_order_value: item.booked_order_value,
    booked_total_qty: item.booked_total_qty,
    booker_discount: item.booker_discount,
    distributor_discount: item.distributor_discount,
    distributor_discount_pkr: item.distributor_discount_pkr,
    final_price: item.final_price,
    gift_value: item.gift_value,
    item_id: item.item_id,
    item_name: item.item_name,
    item_quantity_booker: item.item_quantity_booker,
    item_quantity_updated: item.item_quantity_updated,
    item_retail_price: item.item_retail_price,
    item_sku: item.item_sku,
    original_price: item.original_price,
    parent_item_retail_price: item.parent_item_retail_price,
    parent_pref_id: item.parent_pref_id,
    parent_qty_sold: item.parent_qty_sold,
    parent_tp: item.parent_tp,
    parent_unit_id: item.parent_unit_id,
    pref_id: item.pref_id,
    product_image: item.product_image,
    scheme_discount: item.scheme_discount,
    scheme_id: item.scheme_id,
    scheme_min_quantity: item.scheme_min_quantity,
    scheme_quantity_free: item.scheme_quantity_free,
    scheme_rule: item.scheme_rule,
    scheme_type: item.scheme_type,
    special_discount: item.special_discount,
    special_discount_pkr: item.special_discount_pkr,
    tax_amount: item.tax_amount,
    tax_class_id: item.tax_class_id,
    tax_in_value: item.tax_in_value,
    total_discount: item.total_discount,
    total_retail_price: item.total_retail_price,
    total_tax_amount: item.total_tax_amount,
    unit_id: item.unit_id,
    unit_name: item.unit_name,
    unit_price: item.unit_price,
    unit_price_after_booker_discount: item.unit_price_after_booker_discount,
    unit_price_after_distributor_discount:
      item.unit_price_after_distributor_discount,
    unit_price_after_scheme_discount: item.unit_price_after_scheme_discount,
    unit_price_after_special_discount: item.unit_price_after_special_discount,
  };
  return primaryOrderItem;
};
