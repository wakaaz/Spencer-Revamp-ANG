export interface OrderItem {
    pref_id: number;
    item_quantity_booker: number;
    item_quantity_updated: number;
    quantity_returned: number;
    original_price: number;
    scheme_discount: number;
    unit_price_after_scheme_discount: number;
    merchant_discount: number;
    merchant_discount_pkr: number;
    unit_price_after_merchant_discount: number;
    special_discount: number;
    unit_price_after_special_discount: number;
    booker_discount: number;
    unit_price_after_individual_discount: number;
    quantity: number;
    division_id: number;
    item_name: string;
    unit_name: string;
    unit_id: number;
    brand_id: number;
    item_id: number;
    scheme_id: number;
    scheme_min_quantity: number;
    scheme_quantity_free: number;
    scheme_rule: string;
    gift_value: number;
    parent_pref_id: number;
    parent_unit_id: number;
    parent_brand_id: number;
    parent_tp: number;
    parent_qty_sold: number;
    parent_value_sold: number;
    final_price: number;
    campaign_id: number;
    item_status: number;
    dispatch_status: number;
    reasoning: string;
    order_id: number;
    distributor_id: number;
    region_id: number;
    area_id: number;
    assigned_route_id: number;
    territory_id: number;
    booked_order_value: number;
    booked_total_qty: number;
    gross_sale_amount: number;
    total_retail_price: number;
    tax_class_id: number;
    tax_in_percentage: number;
    tax_in_value: number;
    total_tax_amount: number;
    total_amount_after_tax: number;
    total_discount: number;
}
