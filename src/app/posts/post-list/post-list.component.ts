import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
  })

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = []; // krijojme nje array bosh, i cili lidhet me ngOnInit()
  isLoading = false; // vene pune <mat-spinner *ngIf="isLoading"></mat-spinner>
  totalPosts = 0; // numri se sa posta duhen te jen ne liste
  postsPerPage = 2; //sa posta duam te kena brenda listes
  pageSizeOptions = [1, 2, 3, 5, 10]; // nertojme nje array i cili cdo numer qe ka brenda do na parashtoje se sa posta do shfaqen si pas numrint perkates
  currentPage = 1; // kur shtypim butonin next te tabela, do ka loj ne reshte vetem nje poste pra nese je te reshte 1 dhe do me shu te reshti 5, next do shtypet 4 here.
  userId: string; // krijome nje userId ne component per te mar infomacionin nga serveri i cili eshte gjithashu nje userId
  private postsSub: Subscription; // Vendosim nje Subscription per te ulur sa me shum memoren e array Post
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(public postsService: PostService, private authService: AuthService) {}

  ngOnInit() {

    this.isLoading = true;  // vene pune <mat-spinner *ngIf="isLoading"></mat-spinner> kur duhet te hapet, pra ndodhena te faqa PostCreatComponent, per te kalur te faqa PostListComponent, vonon 1 sekond, per ti then useir ose shikuesit qe applikacioni po kerkon kun nga ngesur i shaqim kete 1 sekondshin nje spinner.

    this.postsService.getPosts(this.postsPerPage, this.currentPage);// nga getPosts marim te gjith infomacionin qe kena ne server

    this.userId = this.authService.getUserId(); // bashkagjisim userId e serverit me userId e componentit per ti percjellur ne html

    // kete informacion e shfaqim ne ekaran ne menyr asinkrone nga medoda Subject
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => { // dhe me ndimen e subscribe e shfaqim ne ekran.

        this.isLoading = false; // dhe kur duhet te bullet <mat-spinner *ngIf="!isLoading"></mat-spinner>, pas 1 sekond fonese nga nje komponent ne tjetrin spinner mbullet.
        this.totalPosts = postData.postCount; // ketu marim count nga database dhe e barazojme ne totalPosts te cilen e traferojme si informacion ne html.
        this.posts = postData.posts; // ku informacionit i vendosim nje emeritm posts
      });

      // this, we don't fetch the current information here, we just push new information. (pra se si te fshim edit dhe delete kur nuk jan ber gogin, por ne ne kete reast i kena fshir te dyja keto butone, edhe kur useri nuk eshte login, edhe kur user eshte login, por si duhet ta regullojme kete problem? )
      this.userIsAuthenticated = this.authService.getIsAuth(); // marim informacionin nga serveri qe useri sapo eshte loguar, dhe kur user loghet krijohet nje token i fshet, kete token e kontrollojme ne server authserver, qe eshte krijuar apo jo, eshte ber login useri apo jo, pra eshte true, eshte ber login, ku kete informacione e barazojme te fuksioni me poshtem.
      // po te vem re ne html e kena paraqitur *ngIf="userIsAuthenticated" nese eshte true, nese rezultati vjen nga serveri false butonat edit dhe delete nuk do shfaqen
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;

        this.userId = this.authService.getUserId(); // bashkagjisim userId e serverit me userId e componentit per ti percjellur ne html

      });
  }

  onChangedPage(pageDate: PageEvent) { // pageIndex dhe pageSize ndodhen ne html, ku meren nga aty lidhen ketu ne komponente nga PageEvent dhe trasmetohen te getPosts, i cili i con te server
    this.isLoading = true;
    this.currentPage = pageDate.pageIndex + 1; // pra vendosim qe currentPage do levizi nga nje post ne tjeter me + 1
    this.postsPerPage = pageDate.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) { // ne baz te id e cila eshte nje string fshim nje post brenda listes.
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() { // ve ne pun Subscription, per te ulur sa me shum memoren e array Post
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

