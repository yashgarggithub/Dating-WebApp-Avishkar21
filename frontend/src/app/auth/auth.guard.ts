import { Injectable } from "@angular/core"; //service=> injectible
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(map(user => {
            const isAuth = !!user;
            if (isAuth) { return true; }   //if(userPresent)
            return this.router.createUrlTree(['/auth']);    //else- send to login page(/auth)
        })
            // , tap(isAuth => {
            //     if(!isAuth){
            //         this.router.navigate(['/auth']);
            //     } 
            // })
        );
    }
} 