import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post; // array Post module
  isLoading = false; // vene pune <mat-spinner *ngIf="isLoading"></mat-spinner>
  form: FormGroup;// I vendosim nje emer FormGroup, i cili na ndimon ne marim informacionet nga inputi
  imagePreview: string; // Cdo kode eshte nje string ne vetvete, ku ne e percaktojme se string.
  private mode = "create"; // me ndimen e Routes ne app-routing.module.ts, therasim komponentin PostCreateComponet nga URL.
  private postId: string; // Cdo kode eshte nje string ne vetvete, ku ne e percaktojme se string.
  private authStatusSub: Subscription;
  constructor(
    public postsService: PostService,
    public route: ActivatedRoute, // ActivatedRoute perman te gjitha informacionet e komponentit breda app-routing.module.ts, ku ne kete raste eshte post-create.component.ts te cilin e e perdorim per dy fuksione, njeher kur duam te ckrijome nje post dhe njeher kur duam ta modifikojme ose ndryshe EDIT.
    private authService: AuthService
  ) {}

  // ngOnInit na ndimon per te mar informacione nga serveri dhe per ti shfaqur ne e karn, ne kete rast pasi shtypet butoni edit i nje informacioni, informacioni do trasferohet brenda inputit post-create.component.ts nga aty ku u krijua.
  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
       this.isLoading = false; // If for some reason, an error should occur on the new post page, then I want to also not show the spinner anymore because right now in the post create page, just as on other pages too or at least just as we had it on other pages, we are setting isLoading to true whenever we are saving that post and then we don't care about the fact or about the result of this add post or update post operation. Now caring about it is easy though. We can again use that AuthStatusListener, just as we did on the sign-up and login page.
    });


    // Ne kete pjese marim informacionin nga input me ndimen e formControlName="title" dhe krijom si objek ne menyer asinkrohne, pa i bere Save Post, dhe pa e regjistruar ne addPost

    // Vendosim dy kushte per te kontrolluar se input eshte boshe apo ka 3 ose me pak se tre element atere ne nuk e lejojme qe te fuksionoj butoni Save Post dhe informaconi te kaloj ne addPost. Keshtu qe shtojme validators: per te kontrolluar per gabime, null na tregon qe eshte nje input bosh qe do mbushet, kontrollohet ne validators per gabime dhe pastaj kalon te onSavePost() per tu shtuar ne database.
    // Validators.required -> ne momenti qe klikoj mausin te input title dhe pa shtuper gje aty klikojme mausin te content atere me ndimen e  <mat-error *ngIf="form.get('title').invalid">Please enter the post title.</mat-error> qe do shfaqet post vizes se inputit

    // null sepse inputi eshte bosh, dhe po shkrujm nje x info, per ta kontrolluar a eshte me i madh se tre elemente, nese po kalon ne vazen tjeter.
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType] // kontrollojme foton ne menyre asingkone nga mime-type.validator.ts nese eshte ne regull apo jo.
      })
    });

    // Per te lidhur 2 komponet PostCreatComponet dhe PostListComponet, krijojme nje app-routing.module.ts ku te dyja komponentet i fusim brenda nje URL. Ne bazh te URL ne lidhim componet nga routerLink ku ndodhen ne cdo html, ndersa ketu ne TypeScrept nga "creat", "edit", "postId" etj. Keshtu qe me ndimen e nje subscribe i ven ne pun nga paramMap ne therasim, cdo post duke e kontrolluar nese ka nje id "postId", nese eshte nje "edit", atere nese ka id, posten e shfaqim brenda inputit te PostCreatComponet per ta modifikuar dhe per ti ber Save Post.

    //  paramMap ben lidhjen e route me subscribe i cili e trasferon informacionin ne input, duke e mar nga serveri sigurisht
    // Kurse ParamMap ben te mundur lidhjen e nje ose me me shum vlerave(informacionenve) njekohesisht.
    // route ose ndyshe ActivatedRoute po ta shikojme me vemendi i gjith informacioni po kontrollohet nga URL, prandaj kena i kena ven thonjezat " "
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) { // kontollojme ne se ka nje id, gjithstu perfaqeson ne app-routing.module.ts { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]}, pra vetem (postId)
        this.mode = "edit"; // pas e kontrollojme qe ka id, e specifikojme si nje edit
        this.postId = paramMap.get("postId"); // Me ndimen e ParamMap marim gjith id(postId), si string

        this.isLoading = true; // vene pune <mat-spinner *ngIf="isLoading"></mat-spinner> kur duhet te hapet

        // ky lloj funksioni sebashku me getPost dhe this.post na ndimon kur, ne PostCreateComponet kena shfaqur nje post e cila eshte regjistrua me perpara ne server dhe i kena dhen edit ose update per ta modifikur dhe per ta regjistrua perseri ne server, nga ky momet kur informacioni edit eshte faqur ne input edhe pasi ti bejme refresh faqes posta, ne te vertet fshihet sepse eshte nje array asinkron dhe me ndimen e spinner per 1 sekonde ku i tregojme userit qe application po kerkon, ne kete poste e shfaqim perseri dukete e mar nga serveri me diment e getPost dhe duke e shfaqur ne menyr asinkrone me ndimen e subscribe ne input. Kjo shfaqe ndodhe brenda 1 sekonde.
        this.postsService.getPost(this.postId).subscribe(postData => { // ne baz te id(postId), qe marim si string, e therasim te njejten id, ne server, pastaj ne database, e cile eshte id e nje poste, dhe e terheqim poste nga serveri ne angular, me te gjitha informacionet qe ka brena(id, title, content, imagePath).

          this.isLoading = false; //  dhe kur informacioni qendet spinner bullet <mat-spinner *ngIf="!isLoading"></mat-spinner>

          this.post = { // pasi i therasim nga serveri i shfaqim ne input me ndimen e array Post ne menyre asinkorone
            // _id e vendesim keshtu dhe jo id sepse ne database id eshte _id dhe ne ketu po marim informacionin nga nodejs si _id dhe po e barazojme ne angular me id
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };

          this.form.setValue({ // pasi i kena ne input, i kontrollojme ne FormGroup ne inputi eshte bosh apo ka gabime para se te shtypim butonin Save Post
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else { // ne te kunderte nese nuk ka nje id(postId), te gjitha funksionet lart jan null,
        this.mode = "create"; // ku me ndimen e url pasi ti japim regresh faqes do kaloj ne faqen PostCreateComponet sepse nuk ka nje id
        this.postId = null;
      }
    });
  }

  //  HTMLInputElement na ndimon per te njofur inputin i cili eshte nje file, ku percaktohet nga files[0]

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];//files[0] na tregon qe eshte nje file, nje input, nje foto brenda

    this.form.patchValue({ image: file }); // patchValue na lidh me form(FormGroup) dhe file te cilin e specifikojme si vlere

    this.form.get("image").updateValueAndValidity();// gjithashtu keto vlera te cilen e emertojme me emrin image, i therasim nga metoda get per ti kontrolluar ne updateValueAndValidity ne se jan te vlefshme apo jo, para se ti regjistrojme ne FormGroup.

    // cdo foto ose objekt percaktohet ne html si [src]="robin-benzrihem-773903-unsplash.jpg" ndersa ne kete raste e kena shenur [src]="imagePreview", sepse duam ta marim si string dhe ta kthejm si nje vlere ne file, per ta kaluar me pas ne FormGroup.
    // nje x foto nuk e marim foton si figur per ta regjistrua ne database por marim permbajtjen e saj, qe eshte nje string
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    //------------------------------------------------------------------------------------------------------------------
  }

  onSavePost() {

    if (this.form.invalid) { // nese eshte gabim dhe eshte bosho inputi return null, pra nuk regjistron as nje gje
      return; // nese e fshim, ate edhe pasi ne input nuk ka informacione brena pasi te shypim butonin Save Post do shtohet nje list boshe pa infomacion, kur se ky funksion e ndalon, te shtohet lista boshe.
    }

    this.isLoading = true; // vene pune <mat-spinner *ngIf="isLoading"></mat-spinner> kur duhet te hapet. Por pse e shtojme nje gje te till ketu? Sepse ne ne app-routing.module.ts, kena vendosu si faqe te par te hapje se application te hapet faqa PostListComponent. Per te kalur nga nje faqe ne faqe von 1 sekonde, atere ne vendosim nje spiner per ta ber allikacionin me flensibel. Sidomos kur shtypim butonin edit per te kalur ne PostCreatComponent, vonon 1.5 sekonda, keshtu qe i tregojme userit ose shikuesit se application po vazhdon se kerkuari infomation, ku duam ta shfaqim ne input PostCreatComponet.

    // po ta vem re onSavePost e kena ndar ne dy pjese, e para kur jena duke krijuar nje poste, dhe e dyta kur e kena krijuar postet dhe duam ta modifikojme
    if (this.mode === "create") { // Nese { path: 'create', component: PostCreateComponent},
      this.postsService.addPost( // i regjistrojme informacionin, nga metoda addPost ne serves
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else { // ne te kunderte, nese { path: 'edit/:postId', component: PostCreateComponent}
      this.postsService.updatePost( // i regjistrojme informacionin, nga metoda updatePost ne serves
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset(); // ky lloj funksinin na ndimon kur duam te bejme edit ose update nje post dhe i japim save posta te shfaqet ne lensten e postave ajo qe eshte modifikur, ne te kundert nese nuk do ta shkruanin do shfaqeshin dy posta, posta para edit dhe update , dhe posta pas edit dhe update, ku kjo gje nuk shkon.
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}

// SHENIM: subscribe eshte shum i rendesishem ne angular, ai quhet nje Observable ne angular, na ndimon per te mar informacione nga serveri psh dhe per ti trasferuar ne htlm, na ndimon per te modifikur html, se si botonin edit apo delete te fshihet atomatikishte nese use nuk eshte ber login, dhe kur te behet login butonat edit dhe delete te shfaqen ne cdo post ne listes. Me nje subscribe therasim metoda te ndyshe si pershembull ParamMap, i cili na krijon mundesin te kontrollojme id e cdo poste me ndimen nje URL dhe app-routing.module.ts




