import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription; // e bejme private sepse lejohet te perdoret mevem ne kete komponent

  constructor(public authService: AuthService) {}

   // Ne ngOnInit therasim nje informacione i cili eshte error dhe krijohet kur ne singup duam te krijojme nje user me te njejtin email qe kena krijuar me perpara, kjo gje nuk lejohet ne database spese cdo user ka nje id unike, prand nese nuk e shkrujme metoden me poshte, nese sa here qe duam te krijojme nje user te ri, me te njejtin email qe kena kriju me perpara do shfaqet ne ekran nje spinner infinet, kurse me metoden e me posht ne modifikojme sinner duke e mbyllur qe te mos shfaqe ne infinite por te shaqet deri sa ne ekran te shfaqet tabela e errorit (error-interceptor.ts), ku na sinjalizon qe email eshte gabim.
   ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
        this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
     if(form.invalid){ // nuk lejon te shoj ne database nje input bosh apo nese eshte me gabime
       return;
     }

     this.isLoading = true; // modifikojme nje spiner kur duhet hapur dhe kur nuk duhet hapur.
     // te dyja si form.value.email dhe form.value.password vin nga name="email" dhe name="password" ne html
     this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}

// form.value mer informacionin nga inputi dhe i jep return ne nje far menyre, nese nuk ka nje input atere atomatikishte behet null

