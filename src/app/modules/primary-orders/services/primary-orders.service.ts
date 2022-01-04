import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/api-urls.constants';
import { HttpBaseService } from 'src/app/core/services/http.service';
// import { CounterSale } from '../models/counter-sale.model';

@Injectable()
export class PrimaryOrdersService {
  constructor(private baseService: HttpBaseService) {}

  getPendingOrdersList(): Observable<any> {
    return this.baseService.get(API_URLS.PENDING_ORDERS);
  }
  getOderDetailById(id: number): Observable<any> {
    return this.baseService.get(API_URLS.FETCH_ORDER_BY_ID + id);
  }
}
