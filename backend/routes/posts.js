

// ne kete faqe ndertojme te gjitha metodat si post, put, get, dhe delete te cilat jan egzaktesisht me metodat qe kena ne angular ku, pervec kesaj na ndimojne qe te lidhena me database. =

const express = require("express"); // importojme librarin express te na lidhi me mongodb
const multer = require("multer"); // https://github.com/expressjs/multer : info. e istallojme per te lejuar edhe nje file te regjistrohet ne database

const router = express.Router(); // ky lloj router eshte i gjashem me router ne angular ku ne lidhim folderat me njeri tjetrin, kurse ketu mo lidhim metodat me njeratjetren.

const Post = require("../models/post");// inportojme post.js, te cilin e informojme se cfar ka brenda nje array

const checkAuth = require("../middleware/check-auth"); // therasim funksionin i cili kontrollon per cdo token se kush user ka aksese po kush nuk ka aksese eshte krijoj nje post, ti bej update, apo di bej delete. Dhe e vendosim kete emrin checkAuth te funksionet qe useri ka aksese, ne te kundert nese nuk eshte nje user atere nuk ka aksese per te kriuar, bere update, apo delete por vetem perte pare listat e postes dhe nje poste se cfar ka brenda ne vecanti


const MIME_TYPE_MAP = { // na lejon te regjistrojme tre lloje images
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({ // kjo do na bej te mundur regjistrimin e file brenada nodejs ne folderin images, ku ne keto file do ti marim nga nodejs me medotat post dhe put dhe nga nodejs te regjistuara ne folderin images do ti trasferojme ne angular. gjithashtu bejme kontrollin nese jan foto apo ajan vidjo, ne se eshte foto e gjith vlerat qe mer barazohet ne emrin storage.

  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // cfar do lloj foto qe do regjistrojme ne application do regjistrohet ketu ne nodejs
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext); // dhe regjistrimi i fotove ne folderin images do behet ne baz te kety informacioneve ketu.
  }
});


// post na sherben per te futur te dhena ne mongodb
// installoj ne angular npm install --save body-parser
// multer({storage: storage}).single("image") cdo foto qe fusim ne input e regjistrojme ne folderin e nodejs me emer images, gjithashut kontrollon nese foto jan ndo nje objek tjeter si vidjoja apo jo, te cilat objektet e tjera pervec fotove i nxjere error.

router.post("", checkAuth , multer({storage: storage}).single("image"), (req, res, next) => { // "/api/posts/"

  const url = req.protocol + '://' + req.get("host"); // pra ketu nuk po marim fotot si imazh por po mar foton si sintakse, si nje location me shkrim

  // krijom objeket ne array Post ku vlerat i marim nga post.js
  const post = new Post({ // fusim informacionet brenda array Post i cili eshte array ansinkron i nodejs si eshte array asinkron in angularit, gjithashtu perfaqeson post.js NE FOLDERIN models
    // shemin: te gjitha ato qe jam me req vin nga angulari, kurse antributi title: dhe me radhe jan ketu ne nodejs ne folderin models
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" +req.file.filename,
    creator: req.userData.userId // story userID(4KJLKFJLG88KJDKJL) per cdo user qe krijuon nje post te re
  });

  // conluse.log(req.userData); do tregoj ne server te nodejs email: (test2@test.com) dhe userId: (4KJLKFJLG88KJDKJL), ku infromacionin si title, content dhe imagePath regjistrohen ne database ne baz te email dhe userId te cdo useri qe eshte bere login. Pra email dhe userId jan krijuar ne user.js, controllohen nga check-auth.js qe eshte krijuar nje email , nje userId i fshete dhe nje token, ne se po, trasmetohen ketu ne posts.js.
  // Por pse behet kjo? Sepse ne duam qe cdo user, me nje ID unike, te ket akses te ato posta qe ka krijuar vet, ne update dhe delete, nese nje x poste qe eshte ne listen e postave nuk eshte e krijuar nga nje Y USER, ajo poste vetem te shikohet cfare ka brenda nga Y_USER por nuk mund te fshihet apo te behet update nga Y_USER vetem nga X_USER nga i cili eshte krijuar.

  post.save().then(createPost => { // array post ansikron i bushur me informacione i exportojme ne database(mongodb) nga metoda save() si rikuset json
    res.status(201).json({
      message: 'Post added successfully.', // dhe mepas shaqim ne localhost4200 qe posta u shtua me suksese
      post: {
        ...createPost, // 3 pikat mbrapa createPost jan te === me title, content, imagePath
        id: createPost._id,
        // title: createPost.title, te treja keto jan te barabarta me ...createPost
        // content: createPost.content,
        // imagePath: createPost.imagePath
      }
     });
  }).catch(error => { // kur ka error
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
});

// multer({storage: storage}).single("image") cdo foto qe fusim ne input e regjistrojme ne folderin e nodejs me emer images, gjithashut kontrollon nese foto jan ndo nje objek tjeter si vidjoja apo jo, te cilat objektet e tjera pervec fotove i nxjere error.
router.put("/:id", checkAuth,  multer({storage: storage}).single("image"), (req, res, next) => { // "/api/posts/:id"

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" +req.file.filename;
  }

  const post = new Post({ // fusim informacionet brenda array Post i cili eshte array ansinkron i nodejs si eshte array ansinkron i angularit.
    _id: req.body.id, // kete ketu e kena shtuar sepse na dilte eror, sepse kur lidhet database me nodejs, per cdo informacion qe krijohet sintaksa e informacionit eshte _id e cili eshte e krijuar vete atomatikisht, pra nuk e kena krijuar ne ne post.js ne folderin modules
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId // bashkangjsim informacionin qe vjen nga chech-auth.js gjithashtu edhe ne updateOne
  });
  // marim te dhenat ne menyre asinkrone aga array Post dhe i modifikojme ne databaase mongodb nga metoda updateOne.
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => { // vlerat regjistrohen nga updateOne ne baz te id.

    // ne consule.log te nodejs nModified = 1 kur nje post eshte modifikur ne te kundert eshte 0, prandja eshte > se 0.
    // nModified vjen si emer nga database, dhe na tregon se sa posta jan modifikuar
    if(result.nModified > 0){
      res.status(200).json({ message: "Update Sussessful!"}); // nese eshte i njejti user qe e ka krijuar
    } else {
      res.status(401).json({ message: "Not Authorized!"}); // nese eshte nje user tjeter jo ai qe e ka krijuar, porta 401 na tregon error
    }

  }).catch(error => { // nese shkon keq ndo nje gje me lart atere do ta shfaqet ne ekran Cound't update post!
    res.status(500).json({
      message: "Cound't update post!"
    });
  });
});

// get na sherben per te mar te dhena nga mongodb
// na ndomon per te mar nje poste dhe per ta shtuar ne array e cila sapo eshte ber save
// i bejme nje bodifikim get per ne ven ne pun mat-paginator e cila perfaqeson nje tabel ne post-list

// router.get("",(req, res, next) => { //"/api/posts/"

//   Post.find().then(documents => { // find() ben te mundur gjetjen e dokumenteve te cilit i marim nga mongodb
//      // status(200) ben te mundur qe ne message te pranohen deri ne 200 karakteri
//   res.status(200).json({
//     message: 'Post fetched successfully!',
//     posts: documents
//     });
//   });
// }); nga keshtu e ndryshojme e bejme keshtu, si me poshte.

router.get("",(req, res, next) => { //"/api/posts/"

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts; // e ben let per te eliminuar const me poste te fuksioni

  if(pageSize && currentPage) { // na ndimon se sa posta duma te shfaqim ne list kur thena qe dyhen shfaqur vetem nje poste ose 2 posta ose 3 posta ose 5 posta ose 10 posta njehereshe, ne te kunder nese nuk do ishte ky fuksione posta do shfaqeshin te gjitha dhe tabela nuk do punonte.
    postQuery
     .skip(pageSize * (currentPage - 1))
     .limit(pageSize);
  }

  postQuery.then(documents => {

    fetchedPosts = documents;
    return Post.countDocuments();// na shfaqe ne html se sa poska kena ne table apo sa kena krijuar, ku e kena percakuar totalPosts = 0; sepse duam qe ta gjej vete kodi se sa posta kena krijuar
    // ketu kam ber nje dryshim ne vend te count() kam ven countDocuments

    }).then(count => {

     res.status(200).json({
       message: 'Post fetched successfully!',
       posts: fetchedPosts,
       maxPosts: count
     });

 }).catch(error => { // nese shkon keq ndo nje gje me lart atere do ta shfaqet ne ekran Cound't update post!
 res.status(500).json({
   message: "Fetching posts failed!"
  });
 });
});

// kjo dimon pjsen e updatePost kur duma te mbjaj mesazhin brenda inputit edhe kur i japim refresh faqes
router.get("/:id", (req, res, next) => { // "/api/posts/:id"
  Post.findById(req.params.id).then(post => {
    if ( post ){
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!'})
    }
  }).catch(error => { // nese shkon keq ndo nje gje me lart atere do ta shfaqet ne ekran Cound't update post!
  res.status(500).json({
    message: "Fetching post failed!"
   });
  });
});

// na sherben per te fshire te dhenat ne mongodb
// libraira deleteOne ben te mundur fshirjen nje nje poste, ku id ne mongodb eshte _id dhe ne angular eshte req.params.id, metoda then() e kontrollon nese posts eshte fshire apo jo, nese po na inrofmon ne server te nodejs qe eshte fshire.
router.delete("/:id", checkAuth, (req, res, next) => { // "/api/posts/:id"
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    // ne console.log(result); te nodejs n = 1 kur nje post eshte bere delete, ne te kundert eshte 0, prandja eshte > se 0.
    if(result.n > 0){
      res.status(200).json({ message: "Deletion Sussessful!"}); // ku me ndimen e obsevable ne e shtojme ne e karn qe kjo vlere u shtua me suksese .subscribe(response => consule.log(response));
    } else {
      res.status(401).json({ message: "Not Authorized!"});
    }
  }).catch(error => { // nese shkon keq ndo nje gje me lart atere do ta shfaqet ne ekran Cound't update post!
  res.status(500).json({
    message: "Fetching posts failed!"
   });
  });
});

module.exports = router; // dhe e exportojme di ku tjeter me emrin router

// shenim shum i rendeshishem:
// po te shikosh kena disa nr ne metodat res.status(200).json
// ku: 100 - 199 -> kena informacione, 200 - 299 -> e sukseshme, 300 - 399 -> redirection, 400 - 499 -> client error, 500 - 599 -> server error.
// pra te gjitha keto jan metoda ne json qe quhet status codes, ku secila ka domethenjen e vet
