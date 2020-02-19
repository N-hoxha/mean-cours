 // npm install --save mongoose
 // Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router"; // ndimon nje funksion te caktuar te pershtatet me mir ne URL

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })// vendosim nje Injectable root i cili lidh komponentet me serverin, ka te njejtin funksion me providers: [ PostService ], ne app.module.ts
export class PostService {
  private posts: Post[] = []; // vendosim array post per te shtuar dhe regjistruar postat
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); // kurse ketu regjistrojme posta ne menyre asninkrone pa i shtuar si funksone ne app, update dhe delete, spese shtohen atomatikishte nga metoda getPosts e cila eshte e modifikurar ne nodejs.

  constructor(private http: HttpClient, private router: Router) {}

  getPosts( postsPerPage: number, currentPage: number ) { // modifikojme getPosts per tabelen (mat-paginator)

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // lidhet me :

    // --------------------------------------------------------------------------
    // const pageSize = +req.query.pagesize;
    // const currentPage = +req.query.page;
    // if(pageSize && currentPage) { // na ndimon se sa posta duma te shfaqim ne list kur thena qe dyhen shfaqur vetem nje poste ose 2 posta ose 3 posta ose 5 posta ose 10 posta njehereshe, ne te kunder nese nuk do ishte ky fuksione posta do shfaqeshin te gjitha dhe tabela nuk do punonte.
    //   postQuery
    //    .skip(pageSize * (currentPage - 1))
    //    .limit(pageSize);
    // } ky funksoni ketu ndodhet ne nodejs ku queryParams lidhet drejperdjete me kete funkson ne nodejs.
    //----------------------------------------------------------------------------

    // SHENIM: Dikur ne vend te  posts: any kena pasur  posts: Post[], por kur ne krijome nje post te re, id qe ne, ne post.module.ts ndyshon se njesi nga id behet _id ne mongodb dhe kur duam te marim nje mesazhe nga database nuk e marim dote sepse nuk e njef, atere vendosim nje vlere  posts: any, po marim cfar do lloj informacioni, shtojme ne map te dyte ku na lejon te marim cfare do lloj informacioni brenda array, kur array eshte postsData.posts. Keto informacione qe jan, title, content, _id te cilet krahasohet me njesit e posts.module.ts. Me pas perdorim nje obsevable ose ndyshe nje subscribe ku vlerat si _id psh te cilen e kthyem ne id e trasferojme te vlera trasformedPosts, nga aty te this.post, ku e regjistojme brenda arrayt postsUpdate i cili eshte nje Subject, nga i cili krijohet objekti ne array Post[] ne menry asinkrone, kalon ne subscribe, pastaj ne array postsData.posts ku krahasohet me vlerat e mongodb ku ndyshon vetem id e angularit me _id e mongodb, ku trasferohet nga liku "http://localhost:3000/api/posts" ne NodeJS dhe ne fund ne MongoDB.

    // { message: string; posts: any, maxPosts: number } perfaqesojne json
    // any perfaqeson string, number, image, ID, gjithcka.

    this.http
      .get<{ message: string; posts: any, maxPosts: number }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(
        map(postData => {
          return{ posts: postData.posts.map(post => {
            return { // barazojme njesiete si _id, title, content, imagjePath e mongodb, me id, title, content, imagjePath te angularit
              // SHENIM: TE KATERT KETO NJESI SI title, content, _id, imagePath dhe creator vin nga nodejs ku ne bejme lidhjen me http
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator // therasim nga database nje userId(4KJLKFJLG88KJDKJL) per cdo post qe krijojme nga router.post, i cili regjistron cdo gje ne database.
            };
          }), maxPosts: postData.maxPosts};
        })
      ) // dhe kur i barazojme, i rejgistrojme ne array post ne menyre asinkrone nga fuksioni Subject, per ta shfaqur ne ekran
      .subscribe(transformedPostData => {
        // consule.log(transformedPostData); kontrollojme nga ketu se cfare te denash vine ne consule kur krijohet nje poste
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() { // e shfaqim posten ne menyre asinkrone nga funksioni Subject i cili perfaqeson array Post
    return this.postsUpdated.asObservable(); // funksion i observable ku nuk lejon array bosh
  }

  getPost(id: string) { // ne baz te string id marim komplet poste dhe cojme ne PostCreatComponet pas cdo refreshi qe mund te bejme.

     // I want to create a clone of the object I'm returning and I'll use the spread operator for this to pull out all the properties of an object and add them to a new object so that we again don't accidentally manipulate the original object and now I will just fetch that object from the post array in the posts service with the help of the find method. There, a function will be executed on every post in the array and if it returns true, then this is the post object it will return. If that ID is equal to the ID we're passing as an argument.
     //return {...this.posts.find(p => p.id === id)};


    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();// FormData na lejon qe regjistrojme se bashku ne server jo vetem vlera por edhe file
    postData.append('title', title); // append -> perkthehet shtoje
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => { // gjithashtu keto vlera i regjistrojme edhe ne menyre asinkrone ne metoden Subjekt te array Post

        this.router.navigate(["/"]); // ky lloj funksioni pas cdo Save Post qe do i bejme nje poste unike ajo do ta kthej atomatikishte ne komponentin qe kena percakuar ne app-routing.module.ts i cili eshte:
        //{ path: '', component: PostListComponent }. Pos si? Sepse ne kena regjistura te gjith komponentet ne routing dhe URL. Ku path: '' === ["/"]. Kjo lloj metode behet vetem ne server.
      });
  }

  // Po te vesh re updatePost me addPost jan te njejta vetem se addPost perfaqeson te image nje File kurse updatePost edhe File edhe string, sepse addPost e mer foton si File e con te server per ta ber stirng qe te regjistrohet ne database, kurse updatePost per te ber update nje foto, tile, content e mer foton, title, content si string dhe pastaj foton kur marim nje te re nga file e fusim si file kurse title dhe content si string, prandaj kan kete ndyshim midis tyre.
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData; // let eshte ne vend te const
    if (typeof image === "object") { // ne potoja eshte si objekt e regjistrojme ne postData kur eshte FormData
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { // nese eshte si string, a si vlere e regjistrojme ne menyr asingkone ne postData kur eshte Post
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null // kjo ketu vjen nga module angular, gjithashtu e bejme null sepse duam te krijohet atomatikisht nga nodejs
      };
    }
    this.http // keshtu qe te dyja ansinkronet i regjistrojme ne put nga postData
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {

        this.router.navigate(["/"]); // ky lloj funksioni pas cdo update ose edit qe do i behet nje poste te caktuar ajo do ta kthej atomatikishte ne komponentin qe kena percakuar ne app-routing.module.ts i cili eshte:
        //{ path: '', component: PostListComponent }. Pos si? Sepse ne kena regjistura te gjith komponentet ne routing dhe URL. Ku path: '' === ["/"]. Kjo lloj metode behet vetem ne server.
      });
  }

  deletePost(postId: string) { // shtojme nje postId cil e kena ne nodejs /api/posts/:id, sepse cdo poste, cdo infromacione ka id, ku angulari kupton se cilen po fshi.

    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }
}

 // SHENIM: subscribe perdoret per te mar cfare do lloj informacioni qe ndyshon, nga metodat get, add, delete, update ne array Post[] te angularit, pra cdo ndryshim qe betet ne array Post[], te cilat i regjistrojme brenda array nga metoda Subject, te cilat keto ndyshime i shfaqim ne ekran.

 // Subject eshte nje metode qe perdoret vetem ne server, e cila i ben update array, ne kete raste kemi array Post[], per cfare do lloj nryshimi qe behet ne array, qoft kur shtojme nje mesazh, kur e fshim ate, kur i bejme update, apo kur e therasim, na i shfaqe ne ekarn te gjith array, nese eshte plot e fshim, na shfaqet vetem ato mesazhe qe nuk kena fshire, pra i ben update ne kohe reale cfare do lloj ndyshimi qe bejme nga medota add, get, delete, update ne array Post[].

// ----------------------------------------------------------------------------------------------------------------------------

