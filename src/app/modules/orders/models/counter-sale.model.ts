import { OrderItem } from './order-item.model';

export interface CounterSale {
    employee_id: number;
    child_retailers: number;
    booker_lats: number;
    booker_longs: number;
    distance: number;
    within_radius: number;
    status: string;
    status_code: number;
    order_total: number;
    ttl_qty_sold: number;
    ttl_products_sold: number;
    approved: number;
    remarks: string;
    phone_order: number;
    offline_order: number;
    out_of_plan: number;
    approved_by: number;
    approved_at: string;
    created_at: string;
    synced_at: string;
    updated_at: string;
    updated_by: number;
    updated_by_dist: number;
    completed_by: number;
    processed_at: string;
    processed_by: number;
    dispatched_by: number;
    dispatched_at: string;
    completed_by_dist: number;
    cancelled_by_dist: number;
    completed_at: string;
    cancelled_at: string;
    cancelled_by: number;
    booking_region: number;
    booking_area: number;
    booking_territory: number;
    invoice_number: string;
    freight_charges: number;
    booking_zone: number;
    booking_locality_id: number;
    booking_neighbourhood_id: number;
    sales_man_id: number;
    order_unique_key: string;
    spot_sale: number;
    counter_sale: number;
    invoice_date: string;
    distributor_id: number;
    region_id: number;
    area_id: number;
    assigned_route_id: number;
    items: Array<OrderItem>;
}
