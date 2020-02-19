
// Me ndimen e HTTP Reaquest qe lidhe angular me nodejs, i gjith funksioni me moshte lidhe response   res.status(500).json dhe res.status(401).json, nga message si key qe eshte, me pas e kalojme ne error.component.ts pastaj ne error.component.html ku mesazhet qe kena te shkrujtura ne nodejs te cilet na komunikojne qe nje x email ne singup eshte i krijuar nje here apo ne login qe x email kodi eshte gabim, pra HttpInterceptor na ndimon te lidha direkt me nodejs.


import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) {}

  // MatDialog ka te njejten funksion si alert( ku per cdo gamin qe kena ne application na shfaqet nje dabel ku na paralajmeron qe kena nje gabim).

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // req -> Kërkesa dalëse për të trajtuar
    // next -> Interceptori i ardhshëm në zinxhir, ose mbështetja nëse nuk ka interceptues në zinxhir.

    //Shumica e interceptorëve transformojnë kërkesën që po largohet përpara se ta kalojnë atë tek interceptuesi i ardhshëm në zinxhir, duke e quajtur "next.handle" (transformuarReq). Një interceptor mund të transformojë edhe rrjedhën e ngjarjes së përgjigjes, duke aplikuar operatorë shtesë RxJS në rrjedhën e kthyer nga next.handle ().

    return next.handle(req).pipe( // perdorim pipe per te shtuar nje operator
      catchError((error: HttpErrorResponse) => {
        // catchError allows us to handle errors emitted in this stream and since this is for an HTTP request

        let errorMessage = "An unknown error occurred!";
        if(error.error.message) {
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);

        // throwError -> will generate a new observable to which we can just pass that error
      })
    );
  }
}



