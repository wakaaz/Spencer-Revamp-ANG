import { IorderItems } from './commonOrderItems';
import { PrimaryOrderItem } from './orderItems';

export interface IupdateOrdercontent extends IorderItems {
  quantity_returned: number;
  quantity: number;
  gross_sale_amount: number;
  tax_in_percentage: number;
  total_amount_after_tax: number;
  dispatch_status: number;
  dispatch_qty: number;
  dispatch_amount: number;
  executed_qty: number;
  executed_amount: number;
  parent_value_sold: number;
  booker_discount_pkr: number;
  special_discount_pkr: number;
}

export interface IupdateOrder {
  frieght_price: number;
  order_content: IupdateOrdercontent[];
}

export class UpdateOrder implements IupdateOrder {
  frieght_price: number;
  order_content: IupdateOrdercontent[];
}

//#region  get New update Order Content Object

export const getNewOrderContentObject = (
  primaryOrderItem: PrimaryOrderItem
) => {
  console.log('primaryOrderItem.item_id => ', primaryOrderItem.item_id);
  const orderContent: IupdateOrdercontent = {
    quantity: primaryOrderItem.quantity,
    brand_id: primaryOrderItem.brand_id,
    quantity_returned: 0, // quantity returned zero on cancle
    gross_sale_amount: primaryOrderItem.grossPrice,
    tax_in_percentage: primaryOrderItem.tax_amount,
    total_amount_after_tax: primaryOrderItem.totalBill,
    dispatch_status: null,
    dispatch_qty: 0, // dispatch qty edit on zero
    dispatch_amount: 0, // dispatch ammount edit 0
    // 0, //dispatch amount, edit 0
    executed_qty: primaryOrderItem.parent_qty_sold, // executedQty,
    executed_amount: 0, // executed amount // edit 0
    parent_value_sold: primaryOrderItem.grossPrice, //TODO
    booker_discount_pkr: primaryOrderItem.extraDiscount, // booker discount in pkr *  pr qty
    parent_pref_id: primaryOrderItem.parent_pref_id,
    pref_id: primaryOrderItem.pref_id,
    item_id: primaryOrderItem.item_id,
    parent_unit_id: primaryOrderItem.parent_unit_id,
    unit_id: primaryOrderItem.unit_id,
    parent_tp: primaryOrderItem.parent_tp,
    original_price: primaryOrderItem.original_price,
    item_quantity_booker: primaryOrderItem.quantity,
    parent_qty_sold: primaryOrderItem.parent_qty_sold,
    scheme_id: primaryOrderItem.scheme_id,
    scheme_min_quantity: primaryOrderItem.scheme_min_quantity,
    scheme_quantity_free: primaryOrderItem.scheme_quantity_free,
    scheme_rule: primaryOrderItem.scheme_rule,
    scheme_type: primaryOrderItem.scheme_type,
    gift_value: primaryOrderItem.gift_value,
    scheme_discount: primaryOrderItem.scheme_discount_on_tp,
    unit_price_after_scheme_discount:
      primaryOrderItem.unit_price_after_scheme_discount, // cal unit price aftrer scheme discount
    distributor_discount: primaryOrderItem.distributor_discount,
    distributor_discount_pkr: primaryOrderItem.distributorDiscount, // cal distributor discount
    unit_price_after_distributor_discount:
      primaryOrderItem.unit_price_after_distributor_discount, // unit price after  disctributor discount
    special_discount: primaryOrderItem.special_discount,
    unit_price_after_special_discount:
      primaryOrderItem.unit_price_after_special_discount, // cal unit price after speacial discount
    booker_discount: primaryOrderItem.booker_discount,
    unit_price_after_booker_discount:
      primaryOrderItem.unit_price_after_booker_discount, // unit price after booker discount
    total_discount: primaryOrderItem.allDiscounts, // total disocunt for this item, pkr sum all disc
    unit_price: primaryOrderItem.unit_price,
    final_price: primaryOrderItem.totalBill, // calc final price,  total bill
    booked_total_qty: primaryOrderItem.parent_qty_sold, // not know whats that
    booked_order_value: primaryOrderItem.totalBill, // not know whats that
    parent_item_retail_price: primaryOrderItem.grossPrice,
    item_retail_price: primaryOrderItem.item_retail_price,
    total_retail_price: primaryOrderItem.totalRetailPrice, // calc total retail price * pr_Qty
    tax_class_id: primaryOrderItem.tax_class_id,
    tax_in_value: primaryOrderItem.tax, // not know that is that
    total_tax_amount: primaryOrderItem.tax,
    special_discount_pkr: primaryOrderItem.specialDiscount, // calc total tax amount
    // );
  };
  return orderContent;
};
