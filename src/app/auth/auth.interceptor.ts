
// PERTE LIDHUR TE GJITHE KETE KODE ME PJESEN TJETER TE KODEVE SHOTJME NE APP.MODULE.TS:
// providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ]

// I GJITH KODI MEMOSHT NA BEN TE MUNDRU LIDHJE ME SERVERIN NE NODEJS TE check-auth.js NGA IMPIMINTIMI I HttpInterceptor I CILI NA NDIMON TE SHOJME FUNKSIONET SI  HttpRequest DHE HttpHandler MARIN TOKEN TE SIGURT NGA VJEDHJA TE CILET MBOHETN NGA FUNKSIONIT (Authorization, Bearer), DHE I TRASFEROJME TE check-auth.js nga fuksioni:
// intercept(req: HttpRequest<any>, next: HttpHandler) dhe return next.handle(authRequest); ME DIM TE URL, KU CKLASA check-auth.js E LEXON KETE TOKEN QE VJEN NGA URL, E KONTROLLON ESHTE E NJEJTA TOKEN QE ESHTE KRIJUAR KUR USER SAPO ESHTE BERE LOGIN, PER TE PASUR AKSES NE APIKACIONE, NESE PO ATE AI KA AKSES NE APPLIKACION, NE TE KURDERT NUK KA.

import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable() // shtojme nje injectable per te mar dhe dhen informacione nga nje server ne tjeter

// Funksioni me poshtem ka te njetin funksion si check-auth.js ne nodejs, ku kontrollon userin i cili eshte i authorization per te krujuar, update dhe delete nje post apo jo.

// PRA MARIM TOKEN NGA getToken() METHOD E KRIJUAR NGA USERI I CILI SAPO ESHTE BER LOGIN DHE TA DERGOJME NE check-auth.js NGA FUNKSIONI  headers: KU LIDHET ME const token = req.headers.authorization.split(" ")[1]; ne check-auth.js, ku nga ketu check-auth.js verifikohet nese eshte i njejti token i cili eshte krijuar nga nodejs i secret_this_should_be_longer

export class AuthInterceptor implements HttpInterceptor {

  // dhe nga HttpInterceptor ne na lejohet te perdorim HttpRequest dhe HttpHandler dhe te lidhena drjperdjejte me nje class me emrin check-auth.js te nodejs

  constructor(private authService: AuthService) {}

  // <any> permban te gjith informacionin
  intercept(req: HttpRequest<any>, next: HttpHandler) { // ME DUHET TE GJEJ LLOGJIKEN SI FUNKSIONON NJE HttpRequest DHE HttpHandler NE TE VERTET.

    const authToken = this.authService.getToken(); // marim token nga authService

    const authRequest = req.clone({ // clone() krijon nje kopjo te nje requesti

      // req.headers na mundeson lidhjen me const token = req.headers.authorization.split(" ")[1]; ne check-auth.js ne nodejs

      // set () -> adds a new header to the headers and it sets the value for it but if that header already existed

      headers: req.headers.set("Authorization", "Bearer " + authToken)
      // headers: -> Koka e daljes për këtë kërkesë.
      // req -> Kërkesa dalëse për të trajtuar
      // next -> Interceptori i ardhshëm në zinxhir, ose mbështetja nëse nuk ka interceptues në zinxhir.

      // Authoriaztion lidhet dreteperdjeret me app.js

      //HttpRequest përfaqëson një kërkesë dalëse, duke përfshirë URL, metodën, kokën, trupin dhe opsionet e tjera të konfigurimit të kërkesave. Rastet duhet të supozohen të jenë të pandryshueshme. Për të modifikuar një HttpRequest, duhet të përdoret metoda klon.

      // HttpHandler është injectable. Kur injektohet, instrumenti i drejtuesit dërgon kërkesat tek interceptuesi i parë në zinxhir, i cili dërgon tek i dyti, etj, duke arritur në HttpBackend.

 // Në një HttpInterceptor, parametri HttpHandler është interceptuesi i ardhshëm në zinxhir.

    });


    // handle actually gives us back the response observable stream

    return next.handle(authRequest); // ndersa next. lidhet drejperdrejte me next() ne check-auth.js, i cili mer token e krijuar ne angular nga useri qe eshte bere login dhe e trasferon nga next ne check-auth.js

    // PRA NE TE GJITH KETE FUNKSION I JAPIM DRITEN JELISHE USER QE TE KRIJOJ NJE POST, TI BEJ UPDATE APO TA FSHI ATE, NE TEKUNDERT NUK MUNDET AS TE CRIJOJ AS TE TI BEJ UPDATE DHE AS TE FSHI NJE POST, VETEM TE SHIKOJ LISEN QE PERMBAN POSTA DHE SE CFARE PERMBAJNE POSTAT NE VECANTI.
  }
}

// interceptor is a person or thing that stops or catches (someone os something) going from one flace to another
// catches -> kap, mare
// intercep -> nderpres, kap, ze ne rruge, nderprerje.


// Ne e dimë se HttpHandler është përgjegjës për trajtimin e çdo kërkese HTTP (nga 10 K këmbë lart) dhe ASP.NET përdor përdoruesit e ndryshëm HTTP për t'i shërbyer llojeve të ndryshme të skedarëve. Për shembull, mbajtësi i një faqeje interneti merr një kërkesë HTTP të synuar për disa faqe .aspx ose .html dhe përpunon kërkesën.

// Kjo është mirë; ASP.NET përdor HttpHandler për të përpunuar një kërkesë HTTP, por pse duhet të krijojmë HttpHandler tonë?

// Nëse ne nuk i plotësojmë kërkesat e punës me HttpHandlerin e parazgjedhur të ASP.NET atëherë duhet të krijojmë vetë. Dhe në këtë shembull ne do të krijojmë HttpHandler tonë që do të injektohet në një tubacion HTTP përpunimi të kërkesës.

// Këtu janë disa arsye për të krijuar HttpHandler tonë:

// Zbatimi i veçorive të sigurisë
// Gjenerimi i imazhit dinamik
// Krijo të dhëna RSS dhe të dhëna binare

// ASP.NET është një kornizë e hapur e aplikacionit për serverin në burim të hapur, i projektuar për zhvillimin e uebit për të prodhuar faqe dinamike të uebit. U zhvillua nga Microsoft për të lejuar programuesit të ndërtojnë web faqe dinamike, aplikacione web dhe shërbime të uebit.

// HttpRequest Enables ASP.NET to read the HTTP values sent by a client during a Web request.

//Shumica e interceptorëve transformojnë kërkesën që po largohet përpara se ta kalojnë atë tek interceptuesi i ardhshëm në zinxhir, duke e quajtur "next.handle" (transformuarReq). Një interceptor mund të transformojë edhe rrjedhën e ngjarjes së përgjigjes, duke aplikuar operatorë shtesë RxJS në rrjedhën e kthyer nga next.handle ().

// Më rrallë, një interceptor mund ta trajtojë kërkesën tërësisht dhe të krijojë një rrymë të re të ngjarjes në vend të thirrjes së next.handle (). Ky është një sjellje e pranueshme, por mbani në mend që ndërhyrësit e mëtejshëm do të anashkalohen tërësisht.

// Është gjithashtu e rrallë, por e vlefshme për një interceptor që të kthejë përgjigje të shumta në rrjedhën e ngjarjes për një kërkesë të vetme.

// Bearer authentication (also called token authentication) is an HTTP authentication scheme that involves security tokens called bearer tokens. The name “Bearer authentication” can be understood as “give access to the bearer of this token.” The bearer token is a cryptic string, usually generated by the server in response to a login request. The client must send this token in the Authorization header when making requests to protected resources:

// Basic authentication is a simple authentication scheme built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the word Basic word followed by a space and a base64-encoded string username:password. For example, to authorize as demo / p@55w0rd the client would send

// RFC 7235 defines the HTTP authentication framework which can be used by a server to challenge a client request and by a client to provide authentication information. The challenge and response flow works like this: The server responds to a client with a 401 (Unauthorized) response status and provides information on how to authorize with a WWW-Authenticate response header containing at least one challenge. A client that wants to authenticate itself with a server can then do so by including an Authorization request header field with the credentials. Usually a client will present a password prompt to the user and will then issue the request including the correct Authorization header.

// The HTTP Authorization request header contains the credentials to authenticate a user agent with a server, usually after the server has responded with a 401 Unauthorized status and the WWW-Authenticate header.

