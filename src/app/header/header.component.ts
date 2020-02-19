import { Subscription } from 'rxjs';
 import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthonticated = false; // behet false dhe jo true, per te na ndimuar ne butonat NEW POST DHE LOGOUT (QE JAN TRUE) & BUTONAT LOGIN DHE SINGUP (QE JAN FALSE). nese do ishte true atere userIsAuthonticated do ishtin te kunderta, ku logjina po tashikoje do dukesh null.
  private authListenerSubs: Subscription;

  constructor(public authSercice: AuthService) { }

  ngOnInit() { // fuksioni shikon nese user eshte bere login apo jo, nese eshte bere login atere fshine butonin login dhe singup ne navbar dhe shton butonin logout e New Post me ndimen e *ngIf="!userIsAuthonticated" dhe *ngIf="userIsAuthonticated"

    // te dyja si getIsAuth dhe getAuthStatusListener vertetojne qe useri eshte bere login, prandaj dyhen te dyja ndyshe dalin errore kur jena ber login dhe i japim faqesh refresh dalin errore te krijimi kohes

    this.userIsAuthonticated = this.authSercice.getIsAuth(); // nese nuk e shkrujme kete atere kur jena brenda application dhe i japim refresh na shfaqet application ne fillim te tij, duhet me u bere perseri login qe te futesh ne application. kurse me kete nuk na shfaqet ky problem.


    this.authListenerSubs = this.authSercice.getAuthStatusListener().subscribe(isAuthenticated => {
       this.userIsAuthonticated = isAuthenticated;
    });
  }

  onLogout(){
    this.authSercice.logout();
  }

  ngOnDestroy(){ // na ndimon qe te uli sa me shum memoren e arrayit
    this.authListenerSubs.unsubscribe();
  }

}
