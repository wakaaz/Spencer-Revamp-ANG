import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/api-urls.constants';
import { HttpBaseService } from 'src/app/core/services/http.service';
import { OrderItemDto } from '../_models/orderItemDtos';
import { PrimaryOrder } from '../_models/order';
import {
  IPrimaryOrderItem,
  PrimaryOrderItem,
  setPrimarOrderItem,
} from '../_models/orderItems';
import {
  getNewOrderContentObject,
  IupdateOrdercontent,
  UpdateOrder,
} from '../_models/updateOrder';

@Injectable()
export class PrimaryOrdersService {
  private _orderItemDtos = new BehaviorSubject<OrderItemDto[]>([]);
  constructor(private baseService: HttpBaseService) {}

  public get orderItemDtos(): Observable<OrderItemDto[]> {
    return this._orderItemDtos.asObservable();
  }
  public setOrderItemDtos(primaryOrderItems: IPrimaryOrderItem[]) {
    this._orderItemDtos.next(this.getOrderItemsDto(primaryOrderItems));
  }
  public pushOrderItemDtos(primaryOrderItems: IPrimaryOrderItem[]) {
    this._orderItemDtos.next(this.getOrderItemsDto(primaryOrderItems));
  }
  getPendingOrdersList(): Observable<any> {
    return this.baseService.get(API_URLS.PENDING_ORDERS);
  }
  getOderDetailById(id: number): Observable<any> {
    return this.baseService.get(API_URLS.FETCH_ORDER_BY_ID + id);
  }

  getProductsMetaData(): Observable<any> {
    return this.baseService.get(API_URLS.GET_PRODUCTS_META_DATA);
  }

  updateOrder(primaryOrder: PrimaryOrder): Observable<any> {
    const order = this.getOrderModel(primaryOrder);
    return this.baseService.put(
      `${API_URLS.UPDATE_PRIMARY_ORDER}${primaryOrder.id}`,
      order
    );
  }

  //#region order client side functions

  getOrderModel(primaryOrder: PrimaryOrder): UpdateOrder {
    const order: UpdateOrder = new UpdateOrder();
    order.frieght_price = primaryOrder.frieght_price;
    order.order_content = new Array<IupdateOrdercontent>();
    const LENGHT = primaryOrder.orderContent.length;
    for (let i = 0; i < LENGHT; i++) {
      order.order_content.push(
        getNewOrderContentObject(primaryOrder.orderContent[i])
      );
    }
    return order;
  }

  getPrimaryOrderItem(items: IPrimaryOrderItem[]): PrimaryOrderItem[] {
    const length = items.length;
    let primaryOrderItems: Array<PrimaryOrderItem> =
      new Array<PrimaryOrderItem>();
    for (let i = 0; i < length; i++) {
      primaryOrderItems.push(setPrimarOrderItem(items[i]));
    }
    return primaryOrderItems;
  }

  getOrderDto(orderItem: IPrimaryOrderItem): OrderItemDto {
    const orderItemDto: OrderItemDto = new OrderItemDto(orderItem);
    return orderItemDto;
  }

  getOrderItemsDto(orderItem: IPrimaryOrderItem[]): OrderItemDto[] {
    const orderItemDtos: OrderItemDto[] = [];
    for (let i = 0; i < orderItem.length; i++) {
      orderItemDtos.push(this.getOrderDto(orderItem[i]));
    }
    return orderItemDtos;
  }
  //#endregion
}
