import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription; // e bejme private sepse lejohet te perdoret vetem brenda ketit komponenti

  constructor(public authService: AuthService) { }

  // getAuthStatusListener na informaon kur useri eshte login dhe logout

  // Ne ngOnInit therasim nje informacione i cili eshte error dhe krijohet kur ne singup duam te krijojme nje user me te njejtin email qe kena krijuar me perpara, kjo gje nuk lejohet ne database spese cdo user ka nje id unike, prand nese nuk e shkrujme metoden me poshte, nese sa here qe duam te krijojme nje user te ri, me te njejtin email qe kena kriju me perpara do shfaqet ne ekran nje spinner infinet, kurse me metoden e me posht ne modifikojme sinner duke e mbyllur qe te mos shfaqe ne infinite por te shaqet deri sa ne ekran te shfaqet tabela e errorit (error-interceptor.ts), ku na sinjalizon qe email eshte krujtur nje her .
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
       this.isLoading = false; // false na tregon qe eshte i hapur
    });
  }


  onSingup(form: NgForm) {

    if(form.invalid){  // nese eshte gabim dhe eshte bosho inputi return null, pra nuk regjistron as nje gje
      return;
    }
    this.isLoading = true; // true tregon qe eshte i mbyllur spiner
    // si email dhe password e marim nga html nga name="email" dhe name="password"
    this.authService.createUser(form.value.email, form.value.password);

  }

  ngOnDestroy(){ // na ndimon te ulim sa me shum kapacitetitn e nje array imagjinar
    this.authStatusSub.unsubscribe();
  }


}
