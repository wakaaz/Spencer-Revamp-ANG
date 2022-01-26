export interface IorderItems {
  parent_pref_id: number;
  pref_id: number;
  item_id: number;
  brand_id: number;
  parent_unit_id: number;
  unit_id: number;
  parent_tp: number; // one qty ammount
  original_price: number;
  item_quantity_booker: number; // current
  parent_qty_sold: number; // show parent
  scheme_id: number;
  scheme_min_quantity: number;
  scheme_quantity_free: number;
  scheme_rule: number;
  scheme_type: string;
  gift_value: number;
  scheme_discount: number;
  unit_price_after_scheme_discount: number;
  distributor_discount: number; // %
  distributor_discount_pkr: number;
  unit_price_after_distributor_discount: number;
  special_discount: number; // amount pkr
  unit_price_after_special_discount: number;
  booker_discount: number; // booker discount amount pkr
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
  tax_in_value: number;
  total_tax_amount: number;
}
