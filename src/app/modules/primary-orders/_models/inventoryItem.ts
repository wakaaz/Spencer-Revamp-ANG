//#region Interface inventory item

export interface IInventoryItem {
  brand_id: number;
  created_at: Date;
  created_by: any;
  dist_discount: string; // distributor discount always in %
  division_id: number;
  doc_key: any;
  isAdded: boolean;
  is_active: boolean;
  is_tax: boolean;
  item_brand: string;
  item_id: number;
  item_main_description: string;
  item_name: string;
  item_retail_price: number; // cusumemers sale price retail price calculated from backend (def smalll box prent.quantity *  prent*item_trade_price)
  item_sku: string;
  item_trade_price: number; // sale price from distributor
  main_cat: number;
  packaging_type: number;
  net_amount: number;
  parent: IParent;
  pref_id: number;
  selectedScheme: IScheme;
  price: number;
  scheme_discount: number;
  schemes: IScheme;
  spec_discount: number;
  stockQty: number;
  sub_cat: number;
  tags: any;
  tax_amount: number;
  tax_class_id: number;
  thumbnail: any;
  total_pieces: number;
  unit_id: number;
  unit_name: string;
  unit_price_after_scheme_discount;
  updated_at: Date;
  updated_by: number;
}

//#endregion

//#region Interface Parent
export interface IParent {
  id: number;
  inside_this_uitem_pred_id: number;
  item_id: number;
  item_inside_pref_id: number;
  item_quantity: number;
  item_retail_price: number;
  item_status: boolean;
  item_trade_price: number;
  item_warehouse_price: number;
  pred_id: number;
  qty_in_primary_parent: number;
  quantity: number;
  sequence: number;
  sub_category_id: number;
  unit_id: number;
}

//#endregion

//#region interface schemes

export interface IScheme {
  id: number;
  created_at: number;
  discount_on_top: number;
  division_by: number;
  end_date: Date;
  gift_name: string;
  gift_picture: string;
  gift_value: number;
  min_qty: number;
  quantity_free: number;
  scheme_rule: 1;
  scheme_type: string;
  start_date: Date;
  title: string;
  updated_at: Date;
  updated_by: number;
}

//#endregion
