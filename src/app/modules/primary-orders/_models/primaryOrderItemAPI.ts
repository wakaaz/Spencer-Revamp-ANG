export interface IPrimaryOrderItemAPI {
  parent_pref_id: number;
  pref_id: number;
  item_id: number;
  brand_id: number;
  parent_unit_id: number;
  unit_id: number;
  parent_tp: number;
  original_price: number;
  item_quantity_booker: number;
  parent_qty_sold: number;
  parent_value_sold: number;
  quantity_returned: number;
  gross_sale_amount: number;
  scheme_id: number;
  scheme_min_quantity: number;
  scheme_quantity_free: number;
  scheme_rule: number;
  scheme_type: number;
  gift_value: number;
  scheme_discount: number;
  unit_price_after_scheme_discount: number;
  distributor_discount: number;
  distributor_discount_pkr: number;
  unit_price_after_distributor_discount: number;
  special_discount: number;
  special_discount_pkr: number;
  unit_price_after_special_discount: number;
  booker_discount: number;
  unit_price_after_booker_discount: number;
  total_discount: number;
  unit_price: number;
  final_price: number;
  booked_total_qty: number;
  booked_order_value: number;
  parent_item_retail_price: number;
  item_retail_price: number;
  total_retail_price: number;
  tax_class_id: number;
  tax_in_percentage: number;
  tax_in_value: number;
  total_tax_amount: number;
  total_amount_after_tax: number;
}

export const setPrimaryOrderItemAPI = (item: any) => {
  const primaryOrderItem: IPrimaryOrderItemAPI = {
    parent_pref_id: item.parent_pref_id,
    pref_id: item.pref_id,
    item_id: item.item_id,
    brand_id: item.brand_id,
    parent_unit_id: item.parent_unit_id,
    unit_id: item.unit_id,
    parent_tp: item.parent_tp,
    original_price: item.original_price,
    item_quantity_booker: item.item_quantity_booker,
    parent_qty_sold: item.parent_qty_sold,
    parent_value_sold: item.parent_value_sold,
    quantity_returned: item.quantity_returned,
    gross_sale_amount: item.gross_sale_amount,
    scheme_id: item.scheme_id,
    scheme_min_quantity: item.scheme_min_quantity,
    scheme_quantity_free: item.scheme_quantity_free,
    scheme_rule: item.scheme_rule,
    scheme_type: item.scheme_type,
    gift_value: item.gift_value,
    scheme_discount: item.scheme_discount,
    unit_price_after_scheme_discount: item.unit_price_after_scheme_discount,
    distributor_discount: item.distributor_discount,
    distributor_discount_pkr: item.distributor_discount_pkr,
    unit_price_after_distributor_discount:
      item.unit_price_after_distributor_discount,
    special_discount: item.special_discount,
    special_discount_pkr: item.special_discount_pkr,
    unit_price_after_special_discount: item.unit_price_after_special_discount,
    booker_discount: item.booker_discount,
    unit_price_after_booker_discount: item.unit_price_after_booker_discount,
    total_discount: item.total_discount,
    unit_price: item.unit_price,
    final_price: item.final_price,
    booked_total_qty: item.booked_total_qty,
    booked_order_value: item.booked_order_value,
    parent_item_retail_price: item.parent_item_retail_price,
    item_retail_price: item.item_retail_price,
    total_retail_price: item.total_retail_price,
    tax_class_id: item.tax_class_id,
    tax_in_percentage: item.tax_in_percentage,
    tax_in_value: item.tax_in_value,
    total_tax_amount: item.total_tax_amount,
    total_amount_after_tax: item.total_amount_after_tax,
  };
  return primaryOrderItem;
};

export class PrimaryOrderItemAPI implements IPrimaryOrderItemAPI {
  private _parent_pref_id: number;
  public get parent_pref_id(): number {
    return this._parent_pref_id;
  }
  public set parent_pref_id(v: number) {
    this._parent_pref_id = v;
  }

  private _pref_id: number;
  public get pref_id(): number {
    return this._pref_id;
  }
  public set pref_id(v: number) {
    this._pref_id = v;
  }

  private _item_id: number;
  public get item_id(): number {
    return this._item_id;
  }
  public set item_id(v: number) {
    this._item_id = v;
  }

  private _brand_id: number;
  public get brand_id(): number {
    return this._brand_id;
  }
  public set brand_id(v: number) {
    this._brand_id = v;
  }

  private _parent_unit_id: number;
  public get parent_unit_id(): number {
    return this._parent_unit_id;
  }
  public set parent_unit_id(v: number) {
    this._parent_unit_id = v;
  }

  private _unit_id: number;
  public get unit_id(): number {
    return this._unit_id;
  }
  public set unit_id(v: number) {
    this._unit_id = v;
  }

  private _parent_tp: number;
  public get parent_tp(): number {
    return this._parent_tp;
  }
  public set parent_tp(v: number) {
    this._parent_tp = v;
  }

  private _original_price: number;
  public get original_price(): number {
    return this._original_price;
  }
  public set original_price(v: number) {
    this._original_price = v;
  }

  private _item_quantity_booker: number;
  public get item_quantity_booker(): number {
    return this._item_quantity_booker;
  }
  public set item_quantity_booker(v: number) {
    this._item_quantity_booker = v;
  }

  private _parent_qty_sold: number;
  public get parent_qty_sold(): number {
    return this._parent_qty_sold;
  }
  public set parent_qty_sold(v: number) {
    this._parent_qty_sold = v;
  }

  private _parent_value_sold: number;
  public get parent_value_sold(): number {
    return this._parent_value_sold;
  }
  public set parent_value_sold(v: number) {
    this._parent_value_sold = v;
  }

  private _quantity_returned: number;
  public get quantity_returned(): number {
    return this._quantity_returned;
  }
  public set quantity_returned(v: number) {
    this._quantity_returned = v;
  }

  private _gross_sale_amount: number;
  public get gross_sale_amount(): number {
    return this._gross_sale_amount;
  }
  public set gross_sale_amount(v: number) {
    this._gross_sale_amount = v;
  }

  private _scheme_id: number;
  public get scheme_id(): number {
    return this._scheme_id;
  }
  public set scheme_id(v: number) {
    this._scheme_id = v;
  }

  private _scheme_min_quantity: number;
  public get scheme_min_quantity(): number {
    return this._scheme_min_quantity;
  }
  public set scheme_min_quantity(v: number) {
    this._scheme_min_quantity = v;
  }

  private _scheme_quantity_free: number;
  public get scheme_quantity_free(): number {
    return this._scheme_quantity_free;
  }
  public set scheme_quantity_free(v: number) {
    this._scheme_quantity_free = v;
  }

  private _scheme_rule: number;
  public get scheme_rule(): number {
    return this._scheme_rule;
  }
  public set scheme_rule(v: number) {
    this._scheme_rule = v;
  }

  private _scheme_type: number;
  public get scheme_type(): number {
    return this._scheme_type;
  }
  public set scheme_type(v: number) {
    this._scheme_type = v;
  }

  private _gift_value: number;
  public get gift_value(): number {
    return this._gift_value;
  }
  public set gift_value(v: number) {
    this._gift_value = v;
  }

  private _scheme_discount: number;
  public get scheme_discount(): number {
    return this._scheme_discount;
  }
  public set scheme_discount(v: number) {
    this._scheme_discount = v;
  }

  private _unit_price_after_scheme_discount: number;
  public get unit_price_after_scheme_discount(): number {
    return this._unit_price_after_scheme_discount;
  }
  public set unit_price_after_scheme_discount(v: number) {
    this._unit_price_after_scheme_discount = v;
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

  private _unit_price_after_distributor_discount: number;
  public get unit_price_after_distributor_discount(): number {
    return this._unit_price_after_distributor_discount;
  }
  public set unit_price_after_distributor_discount(v: number) {
    this._unit_price_after_distributor_discount = v;
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

  private _unit_price_after_special_discount: number;
  public get unit_price_after_special_discount(): number {
    return this._unit_price_after_special_discount;
  }
  public set unit_price_after_special_discount(v: number) {
    this._unit_price_after_special_discount = v;
  }

  private _booker_discount: number;
  public get booker_discount(): number {
    return this._booker_discount;
  }
  public set booker_discount(v: number) {
    this._booker_discount = v;
  }

  private _unit_price_after_booker_discount: number;
  public get unit_price_after_booker_discount(): number {
    return this._unit_price_after_booker_discount;
  }
  public set unit_price_after_booker_discount(v: number) {
    this._unit_price_after_booker_discount = v;
  }

  private _total_discount: number;
  public get total_discount(): number {
    return this._total_discount;
  }
  public set total_discount(v: number) {
    this._total_discount = v;
  }

  private _unit_price: number;
  public get unit_price(): number {
    return this._unit_price;
  }
  public set unit_price(v: number) {
    this._unit_price = v;
  }

  private _final_price: number;
  public get final_price(): number {
    return this._final_price;
  }
  public set final_price(v: number) {
    this._final_price = v;
  }

  private _booked_total_qty: number;
  public get booked_total_qty(): number {
    return this._booked_total_qty;
  }
  public set booked_total_qty(v: number) {
    this._booked_total_qty = v;
  }

  private _booked_order_value: number;
  public get booked_order_value(): number {
    return this._booked_order_value;
  }
  public set booked_order_value(v: number) {
    this._booked_order_value = v;
  }

  private _parent_item_retail_price: number;
  public get parent_item_retail_price(): number {
    return this._parent_item_retail_price;
  }
  public set parent_item_retail_price(v: number) {
    this._parent_item_retail_price = v;
  }

  private _item_retail_price: number;
  public get item_retail_price(): number {
    return this._item_retail_price;
  }
  public set item_retail_price(v: number) {
    this._item_retail_price = v;
  }

  private _total_retail_price: number;
  public get total_retail_price(): number {
    return this._total_retail_price;
  }
  public set total_retail_price(v: number) {
    this._total_retail_price = v;
  }

  private _tax_class_id: number;
  public get tax_class_id(): number {
    return this._tax_class_id;
  }
  public set tax_class_id(v: number) {
    this._tax_class_id = v;
  }

  private _tax_in_percentage: number;
  public get tax_in_percentage(): number {
    return this._tax_in_percentage;
  }
  public set tax_in_percentage(v: number) {
    this._tax_in_percentage = v;
  }

  private _tax_in_value: number;
  public get tax_in_value(): number {
    return this._tax_in_value;
  }
  public set tax_in_value(v: number) {
    this._tax_in_value = v;
  }

  private _total_tax_amount: number;
  public get total_tax_amount(): number {
    return this._total_tax_amount;
  }
  public set total_tax_amount(v: number) {
    this._total_tax_amount = v;
  }

  private _total_amount_after_tax: number;
  public get total_amount_after_tax(): number {
    return this._total_amount_after_tax;
  }
  public set total_amount_after_tax(v: number) {
    this._total_amount_after_tax = v;
  }
}
