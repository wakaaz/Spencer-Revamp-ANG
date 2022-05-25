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
import * as moment from 'moment';
import { PRIMARY_ORDER_API_STATUS } from 'src/app/core/constants/primary-orders-parms.constants';

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
  getPendingOrdersList(orderStatus: string): Observable<any> {
    if (PRIMARY_ORDER_API_STATUS.PURCHASE_HISTORY === orderStatus) {
      return this.baseService.get(API_URLS.PURCHASE_ORDERS);
    } else {
      return this.baseService.get(API_URLS.PENDING_ORDERS + orderStatus);
    }
  }
  getOderDetailById(id: number): Observable<any> {
    return this.baseService.get(API_URLS.FETCH_ORDER_BY_ID + id);
  }

  getProductsMetaData(): Observable<any> {
    return this.baseService.get(API_URLS.GET_PRODUCTS_META_DATA);
  }

  getDistributorsEmployees(id: number): Observable<any> {
    return this.baseService.get(API_URLS.DISTRIBUTORS_EMPLOYEES + id);
  }

  getSubDistributors(): Observable<any> {
    return this.baseService.get(API_URLS.SUB_DISTRIBUTORS);
  }

  updateOrderStatus(orderId: number, orderStatus: string): Observable<any> {
    return this.baseService.put(`${API_URLS.UPDATE_ORDER_STATUS}${orderId}`, {
      status: orderStatus,
    });
  }

  updateOrder(primaryOrder: PrimaryOrder): Observable<any> {
    const order = this.getOrderModel(primaryOrder);
    return this.baseService.put(
      `${API_URLS.UPDATE_PRIMARY_ORDER}${primaryOrder.id}`,
      order
    );
  }

  saveOrReturnOrder(
    primaryOrder: PrimaryOrder,
    userId: number,
    isReturnOrder = false
  ): Observable<any> {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const formatedDate = moment(new Date()).format(format);

    const order = this.getOrderModel(primaryOrder);

    order.distributor_id = primaryOrder.distributor_id;
    order.employee_id = primaryOrder.employee_id;
    if (isReturnOrder) {
      order.status = '';
    } else {
      order.status = 'completed';
    }
    order.web_order = 1;
    order.order_type = 5;
    order.executed_by_dist = userId;
    // order.completed_by_dist = userId;
    order.compeleted_at = formatedDate;
    order.executed_at = formatedDate;
    order.booker_lats = 0;
    order.booker_longs = 0;
    order.within_radius = 0;
    order.phone_order = 1;
    order.offline_order = 0;
    order.created_at = formatedDate;
    order.approved = 1;
    return this.baseService.post(
      `${
        isReturnOrder
          ? API_URLS.RETURN_PRIMARY_ORDER
          : API_URLS.SAVE_PRIMARY_ORDER
      }`,
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
