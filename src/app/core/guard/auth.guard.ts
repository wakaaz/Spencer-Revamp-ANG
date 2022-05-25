import { Injectable, Inject } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { localStorageKeys } from '../constants/localstorage.constants';
import { LocalStorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(LocalStorageService) private storageService: LocalStorageService,
    @Inject(Router) private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Can this route be activated?
   * @param ActivatedRouteSnapshot route - The route.
   * @returns true if user is authenticated otherwise false
   */
  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUrl = this.router['location']._platformLocation.location.hash
      .split('#')
      .filter((x) => x)
      .join()
      .split('/')
      .filter((x) => x)
      .join('/');
    const token = this.storageService.getItem(localStorageKeys.session);
    const distributor = this.storageService.getItem(
      localStorageKeys.distributor
    );
    const status = token !== null && distributor !== null;
    if (!status) {
      this.router.navigate(['login'], {
        relativeTo: this.activatedRoute,
        queryParams: { currentUrl },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    }
    return status;
  }
}
