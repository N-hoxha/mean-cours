
// FormsModule mer nje input nga ngMudel dhe per ta trasferuar ne component

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'; // HttpClientModule na ben te mundur te lidhena me Nodejs dhe Express.
import { AppRoutingModule } from './app-routing.module';

// Komponentet
import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

// --------------------------------------------

// ------------- Angular Material | cdo librari funksioni qe na ndimon ne html dhe css e thrasim ketu
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatPaginatorModule} from '@angular/material/paginator';
import { LoginComponent } from './auth/login/login.component';
import { SingupComponent } from './auth/singup/singup.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error-interceptor';
import {MatDialogModule} from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

// -----------------------------------------------------------------------------

// ng add @angular/material instalon angular material
@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SingupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent] // we have to tell Angular that it needs to be prepared to eventually create this component. It normally detects that it needs to be prepared by the fact that we somewhere used the selector or that we use it as a component in the router but since we will dynamically create that component or let that dialog service create it dynamically, we need to tell Angular that this is going to happen otherwise we would get an error.
})
export class AppModule { }

// HTTP_INTERCEPTORS na mundesojme te pertodimr implimentimin e funksionit AuthInterceptor auth.interceptor.ts dhe ErrorInterceptor ne error-interceptor.ts

// Për të përdorur të njëjtën instancë të HttpInterceptors për të gjithë aplikacionin, importoni HttpClientModule vetëm në AppModule tuaj dhe shtoni interceptorët tek injector aplikacioni rrënjë. Nëse importoni HttpClientModule disa herë nëpër module të ndryshme (për shembull, në modulet e ngarkimit me dembel), çdo import krijon një kopje të re të HttpClientModule, i cili mbishkrron interceptorët e dhënë në modulin rrënjë.
