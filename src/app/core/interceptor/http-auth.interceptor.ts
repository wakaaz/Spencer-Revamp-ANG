import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LocalStorageService } from '../services/storage.service';
import { ToasterService } from '../services/toaster.service';
import { localStorageKeys } from '../constants/localstorage.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private storageService: LocalStorageService,
    private toastService: ToasterService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    debugger;
    req = this.setBearerToken(req);
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.toastService.showToaster({
        title: 'Internet Disconnected',
        message: 'Please check your connection and try again!',
        type: 'error',
      });

      // this.snackBarService.openBottomSheet('Internet Disconnected!', 'offline');
      return throwError(
        new HttpErrorResponse({ status: 1, error: 'Internet is required.' })
      );
    } else {
      return next.handle(req).pipe(
        map((response: HttpEvent<any>) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastService.showToaster({
              title: 'Session Expired',
              message: 'Please login to continue!',
              type: 'error',
            });
            document.getElementById('Close-All').click();
            this.storageService.removeItem(localStorageKeys.session);
            this.storageService.removeItem(localStorageKeys.distributor);
            this.router.navigateByUrl('/login');
          }
          return throwError(error);
        })
      );
    }
  }

  setBearerToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.storageService.getItem('dist_session');
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return req;
  }
}
