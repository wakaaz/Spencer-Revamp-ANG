import { PrimaryOrderItem } from './orderItems';

export interface IPrimaryOrder {
  id: number;
  approved: boolean;
  area_name: string;
  booker_lats: number;
  booker_longs: number;
  booking_area: number;
  booking_region: number;
  booking_territory: number;
  catalogue_id: number;
  city_name: number;
  date: Date;
  dist_discount: number;
  distributor_address: number;
  distributor_id: number;
  distributor_name: number;
  distributor_phone: number;
  distributor_poc_phone: number;
  employee_id: number;
  employee_name: string;
  frieght_price: number;
  order_total: number;
  order_total_without_frieght_price: number;
  region_name: string;
  remarks: string;
  status: string;
  territory_name: string;
  within_radius: number;
}

export class PrimaryOrder {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _orderContent: PrimaryOrderItem[];
  public get orderContent(): PrimaryOrderItem[] {
    return this._orderContent;
  }
  public set orderContent(v: PrimaryOrderItem[]) {
    this._orderContent = v;
  }

  private _frieght_price: number;
  public get frieght_price(): number {
    return this._frieght_price || 0;
  }
  public set frieght_price(v: number) {
    this._frieght_price = v;
  }

  private _date: Date;
  public get date(): Date {
    return this._date;
  }
  public set date(v: Date) {
    this._date = v;
  }

  private _distributor_name: string;
  public get distributor_name(): string {
    return this._distributor_name;
  }
  public set distributor_name(v: string) {
    this._distributor_name = v;
  }

  private _employee_name: string;
  public get employee_name(): string {
    return this._employee_name;
  }
  public set employee_name(v: string) {
    this._employee_name = v;
  }

  private _distributor_phone: string;
  public get distributor_phone(): string {
    return this._distributor_phone;
  }
  public set distributor_phone(v: string) {
    this._distributor_phone = v;
  }

  private _distributor_address: string;
  public get distributor_address(): string {
    return this._distributor_address;
  }
  public set distributor_address(v: string) {
    this._distributor_address = v;
  }

  private _status: string;
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    this._status = v;
  }

  //#region getter props for calc
  public get grossPrice(): number {
    return this._orderContent
      ? this.orderContent.reduce((a: any, b: any) => a + b.grossPrice, 0)
      : 0;
  }

  public get discount(): number {
    let discount: number = 0;
    if (this._orderContent) {
      const tradeDiscount = this.getDiscountByField('tradeOffer');
      const distDiscount = this.getDiscountByField('distributorDiscount');
      const speacialDiscount = this.getDiscountByField('specialDiscount');
      const bookerDiscount = this.getDiscountByField('extraDiscount');
      discount =
        tradeDiscount + distDiscount + speacialDiscount + bookerDiscount;
    }
    return discount;
  }
  public get subTotal(): number {
    return this.grossPrice - this.discount;
  }

  public get tax(): number {
    return this.orderContent ? this.getDiscountByField('tax') : 0;
  }
  public get subTotalPlusFrieghtPrice(): number {
    return this.subTotal + this.frieght_price;
  }

  public get total(): number {
    return this.subTotal + this.tax;
  }
  //#endregion

  //#region  priavte cal function for this class
  private getDiscountByField(field: string) {
    return this.orderContent.reduce((a: any, b: any) => a + b[field], 0);
  }
  //#endregion
}
