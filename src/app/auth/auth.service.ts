
// NE KETE SERVER DO LIDHIM KOMPONETET LOGIN DHE SINGUP ME NODEJS USER.JS

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.modul";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })// vendosim nje Injectable root i cili lidh komponentet me serverin, ka te njejtin funksion me providers: [ AuthService ], ne app.module.ts

export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string; // krijome nje userId ketu per te regjstura userId qe po e marim nga nodejs
  private authStatusListener = new Subject<boolean>(); // krijome nje bojekte ne menyre asingrone te lexoj login nese useri eshte ber login, nese token eshte krijuar, nese eshte krujuar si pas kushtin true:( this.authStatusListener.next(true);), atere e regjistron ne emrin authStatusListener qe USER ESHTE BERE LOGIN DHE TOKEN ESHTE KRIJUR, me pas e therasim ne metoden qe kena krijuar me emrin getAuthStatusListener si nje Observable qe te kena te trejete ta trasferojme kete informacion ne nje komponete jashte serverit, ne komponentin header.component.ts i cili header.component.ts shikon nese user eshte bere login apo jo, nese eshte bere login atere fshine butonin login dhe singup ne navbar dhe shton butonin logout me ndimen e *ngIf="!userIsAuthonticated" dhe *ngIf="userIsAuthonticated"

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token; // pasi e zvendosim informacionin token ne kete funkson e kena me te kollajmeshe ta, zvendosim po kete informacion ne komponet apo ne servis.
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable(); // perfaqeson kur useri eshte bere login apo jo, pra eshte true apo false
  }

  getUserId(){
    return this.userId; // marim userid qe krijohet per cdo user qe behet singup
  }

  getIsAuth(){
    return this.isAuthenticated; // nuk e shtojme asObservable sepse nuk eshte objekte, msd cukzionin larte ne eshte false
  }

  createUser(email: string, password: string) {

    const authData: AuthData = {email: email, password: password}; //  I can create a new object and that object needs to have an e-mail which is the e-mail I'm getting as an argument and it needs to have a password which of course is the password I'm getting as an argument.

    // nga http me metoden post e cila eshte e njete me metoden post ne user.js lidhim keto dy servise, servisin e angularin me servisin e nodejs.
    this.http.post("http://localhost:3000/api/user/singup", authData)
     .subscribe(() => {
       this.router.navigate(["/"]); // nese po krijojme nje user te ri nga singup me email dhe password te dryshem nuk do shfaqi error dhe application dhe ta kaloj ne faqen e listave e postave, faqen kryesore me ndimen e rooting
     }, error => { // nese duam te krijojme nje user te ri me te njejtin email qe kena krijuar nje tjeter, ne nuk do ta lejome kete dhe do ta nxjerim atomatikisht null me ndimen e authStatusListener.
       this.authStatusListener.next(false);
     });
   }

   login(email: string, password: string){

    // AuthData eshte nje module.ts
    const authData: AuthData = {email: email, password: password}; //  I can create a new object and that object needs to have an e-mail which is the e-mail I'm getting as an argument and it needs to have a password which of course is the password I'm getting as an argument.

    // post dhe jo get, sepse po dergojme nje input i cili eshte krijuar me perpara ne singup dhe ne nodejs(server), te njejtin input po e kontrollojme nese ekziston apo jo per tu fututurn ne application, pra per tu bere login.
    // <{token: string}>  res.status(200).json({ token: token }); ne user.js
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
     .subscribe(response => {

      const token = response.token; // marim token nga nodejs nga prota res.status(200).json dhe token qe krijohet nga user ne angular ne te njeten koh
      this.token = token; // dhe e regjistrojme ne angular me emrin this.token: string, dhe e zvendosim imformacionin te nje funkson i ri me emrin getToken.

      if(token){
        const expiresInDuration = response.expiresIn; // marim informacionin nga nodejs, me ndimen e http.post
        // console.log(expiresInDuration); e provojme vjen informacioni nga nodejs.

        this.setAuthTimer(expiresInDuration); // marim kurshtin qe per 1 ore aplicacioni do blullet dhe i duhet te behet login, e bejke kete per siguri nese useri e ka len hapur aplication

        this.isAuthenticated = true; // verteton qe token eshte true
        this.authStatusListener.next(true); // lejome qe ky funksion te ket akses kur useri eshte bere login, pra informacionin qe marim deri tashi nga token e regjistrojme ne array imagjinar authStatusListener

        // marim response.userId nga nodejs dhe e barazojme me userid te angulart nga private userId: string
        this.userId = response.userId;

        const now = new Date(); // krijome nje date te re ketu
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000); // e gjitha kjo na mundesoj te gjejme daten dhe ore fiks kur useri eshte bere login
        console.log(expirationDate);

        // marim token dhe daten fikse kur user is login dhe i regjistrojme ne saveAuthData, ku me pas do kalojne ne disa procese si setAuthTimer, saveAuthData, clearAuthData, getAuthData, dhe ne fund autoAuthUser ku do ta modifikojne application te qendroje aty ku eshte edhe kur i bejme refreash faqes ne localhost, nese nuk do ti kishim keto metoda pasi ti benim refresh ne do ktheshim ne faqen par fare, ku do na duhej ti benim login, pas cdo refreshi.
        this.saveAuthData(token, expirationDate, this.userId);

        this.router.navigate(['/']); // SHENIM: ne html nuk shojme dote routerLink="/" te butoni login dhe e shtypim ate duam qe pasi te shtypet te kalojme atomatikishte ne faqen e homit(te lista e postave), sepse del error, por e shtojme ketu sepse application nuk e kupton dot ne html kur useri eshte bere login apo logout.
      }
     }, error => { // jena ne login dhe kur useri eshte krijua, shkojme te login por password e shkrujme gabim atere authStatusListener do na ndimoje qe ne consule te mos na shfaqet error, do na kthej edhe nje here aty ku u nisem te vendosa e input te email dhe password per te hyre ne application, dhe do na ndomje me ndimen e komponetit singup qe te eleminojme spinner, kur useri kruan gabim passwordin
        this.authStatusListener.next(false);
     });
   }

   // na ndimon kur i bejme refresh application, ne te kundert nese nuk e kenina keto metoda pasi do ti benim refresh application do shkonte fe fillim te tij dhe ne na duhesh ti benim login per tu funtur perse ri ne application
   autoAuthUser(){
     const authInformation = this.getAuthData(); // pasi kotrollojme token dhe expirationDate qe ekzitojne apo jo, ne se po i regjistrojme te dyja te dhenat me emrin authInformation.
     // kontrollojme perseri nese nuk ka informacione bernda(nese jena bere logout return nothin mos dalin errore dhe koha te ndalet. )
     if(!authInformation){ // nese nuk e shtojme kete ne momint qe jena jasht application pra nuk jena ber login akoma pas i japim refresh faqesh na del error appilaction, prandaj duhet te shtojme kete tetu.
       return;
     }

     const now = new Date(); // krijome qe date

     const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); // daten qe kena krijuar ne te shkuart(qe jena ber login) - daten qe do krijome ne te ardhmen (koha kur useri eshte ber login ku fillon nga 1 sikonda dhe vashdon deri sa behet login per here te dyte, kur ne bejme refresh)
     if(expiresIn > 0){ // nese koha eshte me e madhe se 0 atere lejohet te futet ne application
       this.token = authInformation.token;
       this.isAuthenticated = true;

       this.userId = authInformation.userId;

       this.setAuthTimer(expiresIn / 1000); // e pjeston per ta llogaritu kohen e milisekonda, sepse ne nodejs e kena ne misekonda, kurse ketu ne angular nga fuksioni setAuthTimer e kena llogaritu me ore, por neve na duhet ta llogarisim me milisekonda qe kerkim te jet me i shpejte

       this.authStatusListener.next(true);
     }
   }


   logout(){ // me kete funksionin ketu, application kupton qe kur shtupim butonin logout useri nuk ka kases te krijoj as te bej edit as te delete, gjithashtu ne navbar do vem re qe do fshihet butonat new post dhe logout dhe do shfaqen butonat login dhe singin. Nese nuk e shkrujme kete funksion butoni logout nuk punon, dhe useri ka aksese perseri te bej edit, delete, dhe create post.
     this.token = null;
     this.isAuthenticated = false;
     this.authStatusListener.next(false);
     this.userId = null; // null sepse po del logout
     clearTimeout(this.tokenTimer);// kur koha 1 ore si kiushte qe kena ven ne nodejs qe nese application qen dron hap mbaron, atere e kaljme atomatikishte ne faqen e pare home(list post)

     this.clearAuthData();

     this.router.navigate(['/']); // SHENIM: ne html nuk shojme dote routerLink="/" te butoni login dhe e shtypim ate duam qe pasi te shtypet te kalojme atomatikishte ne faqen e homit(te lista e postave), sepse del error, por e shtojme ketu sepse application nuk e kupton dot ne html kur useri eshte bere login apo logout.
   }

   private setAuthTimer(duration: number){

    console.log("Setting timer: " + duration);
    // modifikojme application, e bejme me te sigurt, dhe nese user haron application haput mbas 1 ore appllicaton mbyllet edhe nese ai po punon, sepse un ne nodejs e kam shnuar 3600 miliskonda qe jan te barabarte me 3.6 sekonda
    this.tokenTimer = setTimeout(() => {
      this.logout(); // mbas nje ore application do mbyllet.
    }, duration * 1000); // e shumzojme me 1000 sekonda dhe behet 1 ore

   }

   // private sepse po e theras funksionin brenda serverit
   private saveAuthData(token: string, expirationDate: Date, userId: string) { //regjistrojme nje token si string dhe nje expirationDate si Date (pra daten qe user eshte bere login),  pro pres e vendsoim setItem? Sepse setItem mer informacionin si vlere nga http.post(login), dhe e regjistron ne localStorage si nje key me emrin "token".
     localStorage.setItem("token", token);
     localStorage.setItem("expiration", expirationDate.toISOString());
     localStorage.setItem("userId", userId);

     //(ISO) Përfaqësimi i datave dhe orëve është një standard ndërkombëtar që mbulon shkëmbimin e të dhënave që lidhen me datën dhe kohën. Është lëshuar nga Organizata Ndërkombëtare për Standardizim (ISO) dhe është botuar së pari në vitin 1988. Qëllimi i këtij standardi është të sigurojë një metodë të qartë dhe të përcaktuar mirë për të përfaqësuar datat dhe orët, në mënyrë që të shmanget keqinterpretimi i përfaqësimeve numerike të datave dhe herë, veçanërisht kur të dhënat transferohen midis vendeve me konventa të ndryshme për të shkruar datat dhe orët numerike.

     // Vetia e lexuar vetëm localStorage ju lejon të hyni në një objekt ruajtje për origjinën e Dokumentit; të dhënat e ruajtura ruhen në të gjithë sesionet e shfletuesit. localStorage është e ngjashme me sessionStorage, përveç se ndërsa të dhënat e ruajtura në localStorage nuk kanë kohë të skadimit, të dhënat e ruajtura në sessionStorage pastrohen kur sesioni i faqes përfundon - dmth, kur faqja është e mbyllur.

     // Objekti localStorage ruan të dhënat pa afat të skadimit. Të dhënat nuk do të fshihen kur shfletuesi të mbyllet dhe do të jetë i disponueshëm ditën, javën ose vitin tjetër.

   }

   private clearAuthData(){// eshte bere per te ndimuar logout
     localStorage.removeItem("token"); // fshin te dhenat token qe eshte string
     localStorage.removeItem("expiration"); // fshin te dhenat qe eshte nje date
     localStorage.removeItem("userId");
   }

   private getAuthData(){ // pra ketu kontrollojme nese ka nje token dhe nje date fikse qe useri sapo eshte bere login
     // localStorage.getItem("token");  lexon informacionin qe eshte regjistruar si key
     const token = localStorage.getItem("token");
     const expirationDate = localStorage.getItem("expiration");
     const userId = localStorage.getItem("userId");

     if(!token || !expirationDate){ //e kontrollojme, nese nuk ka nje token ose nje date qe user sapo eshte bere login,
       return; // return nothing
     }
     return { // nese ka token dhe nje date atere return token dhe expirationDate
       token: token,
       expirationDate: new Date(expirationDate),
       userId: userId
     }
   }
   // pasi i kontrollojme qe ka nje token dhe nje date fikse kur user eshte bere login kalojme te autoAuthUser
}
