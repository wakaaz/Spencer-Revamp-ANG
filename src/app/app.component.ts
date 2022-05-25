import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './core/services/storage.service';

import {
  inventorySubMenu,
  primaryOrderSubMenu,
  ordersSubMenu,
  paymentsSubMenu,
  reportsSubMenu,
  retailerSubMenu,
  salesmanSubMenu,
} from './core/constants/sub-nav.constants';
import { Toaster, ToasterService } from './core/services/toaster.service';
import { leftBarHidden } from './core/constants/no-left-bar.constants';
import { localStorageKeys } from './core/constants/localstorage.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('subNav') subNav: ElementRef;
  isLoggedIn: boolean;
  isSideNavHidden: boolean;

  toastTitle: string;
  toastMessage: string;
  toastType: string;
  showToast: boolean;

  selectedSubMenu: {
    title: string;
    subMenu: Array<{ title: string; link: string; icon: string }>;
  };

  constructor(
    private router: Router,
    private storageService: LocalStorageService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isLoggedIn = this.storageService.getItem('dist_session')
      ? true
      : false;
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
    // else if (location.pathname === '/') {
    //   this.router.navigateByUrl('/home');
    // }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.storageService.getItem('dist_session')
          ? true
          : false;
        const url = event.urlAfterRedirects;
        if (
          leftBarHidden.includes(url) ||
          url.includes('/orders/dispatch/') ||
          url.includes('/orders/execute-order/')
        ) {
          this.isSideNavHidden = true;
        } else {
          this.isSideNavHidden = false;
        }
      }
    });
    this.toasterHandler();
  }

  toasterHandler(): void {
    this.toasterService.getToast.subscribe((toast: Toaster) => {
      if (toast) {
        this.toastTitle = toast.title;
        this.toastMessage = toast.message;
        this.toastType = toast.type;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 5000);
      }
    });
  }

  openSubmenu(event: Event, selected: string): void {
    event.stopPropagation();
    switch (selected) {
      case 'orders':
        this.selectedSubMenu = ordersSubMenu;
        break;
      case 'primaryOrders':
        this.selectedSubMenu = primaryOrderSubMenu;
        break;
      case 'salesmen':
        this.selectedSubMenu = salesmanSubMenu;
        break;
      case 'inventory':
        this.selectedSubMenu = inventorySubMenu;
        break;
      case 'retailer':
        this.selectedSubMenu = retailerSubMenu;
        break;
      case 'reports':
        this.selectedSubMenu = reportsSubMenu;
        break;
      case 'payments':
        this.selectedSubMenu = paymentsSubMenu;
        break;
      default:
        break;
    }
    this.subNav.nativeElement.className = 'active';
    document.body.classList.add('no-scroll');
    document.getElementById('blureEffct').classList.add('blur-div');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.add('d-block');
  }

  closeSubMenu(): void {
    if (this.subNav.nativeElement.className.includes('active')) {
      this.subNav.nativeElement.className = '';
      document.body.classList.remove('no-scroll');
      document.getElementById('blureEffct').classList.remove('blur-div');
      document
        .getElementsByClassName('overlay-blure')[0]
        .classList.remove('d-block');
    }
  }

  logout(): void {
    this.storageService.removeItem(localStorageKeys.session);
    this.storageService.removeItem(localStorageKeys.distributor);
    this.storageService.removeItem(localStorageKeys.saleman);
    this.storageService.removeItem(localStorageKeys.actions);
    const currentUrl = this.router['location']._platformLocation.location.hash
      .split('#')
      .filter((x) => x)
      .join()
      .split('/')
      .filter((x) => x)
      .join('/');
    this.router.navigate(['login'], {
      relativeTo: this.activatedRoute,
      queryParams: { currentUrl },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
    // this.router.navigateByUrl('/login');
  }

  closeEverything(): void {
    const modal = document.querySelector('div.modal');
    if (modal) {
      const closeButton = modal.querySelector('button.close');
      (closeButton as HTMLButtonElement).click();
    }
  }
}
