import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './core/services/storage.service';

import {
  inventorySubMenu,
  ordersSubMenu,
  paymentsSubMenu,
  reportsSubMenu,
  retailerSubMenu,
  salesmanSubMenu
} from './core/constants/sub-nav.constants';
import { Toaster, ToasterService } from './core/services/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('subNav') subNav: ElementRef;
  isLoggedIn: boolean;

  toastTitle: string;
  toastMessage: string;
  toastType: string;
  showToast: boolean;

  selectedSubMenu: { title: string; subMenu: Array<{ title: string, link: string, icon: string }> };

  constructor(
    private router: Router,
    private storageService: LocalStorageService,
    private toasterService: ToasterService,
  ) {
    this.isLoggedIn = this.storageService.getItem('dist_session') ? true : false;
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
    } else if (location.pathname === '/') {
      this.router.navigateByUrl('/home');
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.storageService.getItem('dist_session') ? true : false;
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
        }, 3000);
      }
    });
  }

  openSubmenu(event: Event, selected: string): void {
    event.stopPropagation();
    switch (selected) {
      case 'orders':
        this.selectedSubMenu = ordersSubMenu;
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
    document.getElementsByClassName('overlay-blure')[0].classList.add('d-block');
  }

  closeSubMenu(): void {
    if (this.subNav.nativeElement.className.includes('active')) {
      this.subNav.nativeElement.className = '';
      document.body.classList.remove('no-scroll');
      document.getElementById('blureEffct').classList.remove('blur-div');
      document.getElementsByClassName('overlay-blure')[0].classList.remove('d-block');
    }
  }

  logout(): void {
    this.storageService.removeItem('dist_session');
    this.storageService.removeItem('distributor');
    this.storageService.removeItem('__saleman');
    this.router.navigateByUrl('/login');
  }

}
