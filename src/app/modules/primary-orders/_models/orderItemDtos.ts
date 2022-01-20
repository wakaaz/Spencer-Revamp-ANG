import { IPrimaryOrderItem } from './orderItems';

import Utility from '../../../core/utility/orderCalculation';
// display order on edit page
export interface IOrderItemDto {
  sku: string;
  itemName: string;
  quantity: number;
  tp: number;
  grossPrice: number;
  tradeOffer: number;
  distributorDiscount: number;
  specialDiscount: number;
  extraDiscount: number;
  tax: number;
  totalBill: number;
}

export class OrderItemDto implements IOrderItemDto {
  //constructor
  constructor(private _orderItem: IPrimaryOrderItem = null) {
    if (this._orderItem) {
      this.setFields();
    }
  }
  setFields() {
    this.sku = this.orderItem.item_sku;
    this.itemName = this.orderItem.item_name;
    this.quantity = this.orderItem.parent_qty_sold;
    this.tp = this.orderItem.parent_tp;
    this.grossPrice = Utility.calGrossAmount(this.tp, this.quantity);
    this.tradeOffer = Utility.calTradeOfferPrice();
    this.distributorDiscount = Utility.calDistributorDiscount(
      this.orderItem.distributor_discount,
      this.tp,
      this.quantity
    );
    this.specialDiscount = Utility.calSpeacialDiscount(
      this.orderItem.special_discount,
      this.quantity
    );
    this.extraDiscount = Utility.calExtraOrBookerDiscount(
      this.orderItem.booker_discount,
      this.quantity
    );
    this.tax = Utility.calTax(
      this.orderItem.tax_amount,
      this.orderItem.item_retail_price,
      this.quantity
    );
    this.totalBill =
      this.grossPrice -
      this.tradeOffer -
      this.distributorDiscount -
      this.specialDiscount -
      this.extraDiscount +
      this.tax;
  }

  //#region props
  public get orderItem(): IPrimaryOrderItem {
    return this._orderItem;
  }
  public set orderItem(v: IPrimaryOrderItem) {
    this._orderItem = v;
  }

  private _sku: string;
  public get sku(): string {
    return this._sku;
  }
  public set sku(v: string) {
    this._sku = v;
  }

  private _itemName: string;
  public get itemName(): string {
    return this._itemName;
  }
  public set itemName(v: string) {
    this._itemName = v;
  }

  private _quantity: number;
  public get quantity(): number {
    return this._quantity;
  }
  public set quantity(v: number) {
    this._quantity = v;
  }

  private _tp: number;
  public get tp(): number {
    return this._tp;
  }
  public set tp(v: number) {
    this._tp = v;
  }

  private _grossPrice: number;
  public get grossPrice(): number {
    return this._grossPrice;
  }
  public set grossPrice(v: number) {
    this._grossPrice = this._tp * this.quantity;
  }

  private _tradeOffer: number;
  public get tradeOffer(): number {
    return this._tradeOffer;
  }
  public set tradeOffer(v: number) {
    this._tradeOffer = v;
  }

  private _distributorDiscount: number;
  public get distributorDiscount(): number {
    return this._distributorDiscount;
  }
  public set distributorDiscount(v: number) {
    this._distributorDiscount = v;
  }

  private _specialDiscount: number;
  public get specialDiscount(): number {
    return this._specialDiscount;
  }
  public set specialDiscount(v: number) {
    this._specialDiscount = v;
  }

  private _extraDiscount: number;
  public get extraDiscount(): number {
    return this._extraDiscount;
  }
  public set extraDiscount(v: number) {
    this._extraDiscount = v;
  }

  private _tax: number;
  public get tax(): number {
    return this._tax;
  }
  public set tax(v: number) {
    this._tax = v;
  }

  private _totalBill: number;
  public get totalBill(): number {
    return this._totalBill;
  }
  public set totalBill(v: number) {
    this._totalBill = v;
  }
  //#endregion
}
