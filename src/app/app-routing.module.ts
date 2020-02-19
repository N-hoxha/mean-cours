import { NgModule } from '@angular/core';

import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SingupComponent } from './auth/singup/singup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [

  // path: '' do te thot qe kur te hapet aplicacioni te hapet ne faqen e par, me komponent PostListComponent, ose ndyshe localHost:4200
  //  path: 'create' shkruhet vetem ne kete menyre dhe supozohet te jete nu URL localhost:4200/create
  // path: ' i ve nje emer cfare te duash '
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'singup', component: SingupComponent}

];

@NgModule({

  // shtojme nje exports: [RouterModule], per arsye qe te gjith informacionin qe kena brenda kesaj faqe ta trasferoj diku tjeter te app.module.ts ne imports: [ .. AppRoutingModule ]
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
