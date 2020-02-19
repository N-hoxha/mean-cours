import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from '@angular/core';


// Krijom nje servis me emrin authGuard(Roja e authontication), i cili nuk lejon pa u bere login te futesh ne faqen e create post dhe faqen e edit dhe delete nga URL ose ndyshe localhost:4200. Gjithashtu kur e shtupim ne localhost:4200/create dhe ti japim enter te na kaloj atomatikisht ne faqen login.
// Para se mos ta benim kete server, as nje nga funksionet me lart nuk punonin dhe nxirnim probleme ne application.

@Injectable() //  if you want to inject services into services, you have to add this annotation
export class AuthGuard implements CanActivate {

  constructor( private authServer: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    const isAuth = this.authServer.getIsAuth(); // marim vertetimin qe useri eshte bere login.
    if(!isAuth){ // nese nuk eshte bere login, atere pasi te shtupi ne localhost, localhost:4200/create, do kaloj atomatikishte ne faqen e login.
      this.router.navigate(['/login']);
    }
   return isAuth; // por qe funksioni ne punoj sic duhet modifikohet url ne app-routing.module.ts nga funksioni:
                  // canActivate: [AuthGuard]
  }

}
