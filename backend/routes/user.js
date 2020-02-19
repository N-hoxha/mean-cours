// npm install --save bcrypt | e istalojme per te fshehur kodet e cdo user si pas menyres JSON Token
// nese na dalin errore me bcrypt installjme npm install --save bcryptjs
// ne kete faqe ndertojme te gjitha metodat si post, put, get, dhe delete te cilat jan egzaktesisht me metodat qe kena ne angular ku, me ndimen e Router() ne keto informcione i dergojme te app.js i cili na mundeson te lidhena me mongodb
// npm install --save jsonwebtoken installojme JSON TOKEN

const express = require("express"); // importojme librarin express te na lidhi me mongodb
const router = express.Router(); // na ndimon te lidhim metodata nga nje path ose ndyshe nga URL
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // therasim librarin bcrypt, e cila do na ndimoj te fshehim kodet ne userit ne JSON Token
const jwt = require("jsonwebtoken");

// Krijome nje user unik ne database me nje password te fshet, por nese te njetin user me te njejtin email dhe password do shkruhet ne singup ne consule.log do dilte error sepse nuk lejohet qe te krijosh nje user te ri tjeter me te njejtin email dhe password.
router.post("/singup", (req, res, next) => {

  //This hash method takes an input and that is the value we want to hash, so it uses mathematics basically to generate a random number and to generate a hash which is secure. I'll use 10 which is a value high enough to yield a secure hash and not take infinitely which you also don't want
  bcrypt.hash(req.body.password, 10).then(hash => { // requstin e marim nga input qe shruhet ne angular

    const user = new User({ // krijon nje User array me te dhenat ne model user.js

      email: req.body.email,
      password: hash // ne vend te password gjenerojme nje password te fshet me 10 shfira

    });

    // dhe pasi input i kena futur brenda array asikron me emrin User, kete informacion ne regjistrojme ne database mongodb duke e trasferua si rikuset nga porta qe kena ndertuar me numrin 201

    user.save().then(result => {
      res.status(201).json({// e bejme response se duam ta shfaqim ne web consule qe eshte shfaqur neregull

        message: 'User created!',
        result: result

      });
    // ne te kundert nese ka error hapim nje porte tjeter requesti me numrin 500, per tena informuar nese ka error apo jo.
    }).catch( err => { // catch -> kap

      res.status(500).json({ // kur eshte error
          message: "Invalid authentication credentials!"

      });

    });
  });
});

// I want to do as I want to create such a token. Well first I want to validate whether the credentials are valid, but if that's the case, then I want to validate the user.
router.post("/login", (req, res, next) => {

  let fetchedUser; // na mundeson lidhjen midis funsine if(){} te nje funkson conts

  // po te vem re kena return ne kete funksin post, ndyshe nga post me larte sepse ketu jena duke therintur email dhe password e userit qe shkruhet te login dhe po e kontrollojme nese eshte i njejt me ate ne singup ose jo nese nuk eshte atere per cod fuksione return auth failed


  User.findOne({ email: req.body.email }) // kontrollojme email nese ekziston apo jo
    .then(user => { // then sepse jena duke mar nje response, nga angulari(user), qe email ekxiston apo jo
      if (!user) { // user does not exists
        return res.status(401).json({
          message: "Auth failed" // informojme nje error Auth failed
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password); // krahasojme password i cili eshte krijuar ne singup me passwordin qe user po funt ne login nese jan te njet apo jo, nese nuk jan ate then.....
    })
    .then(result => {

      if (!result) { // nese nuk jan informojme user ne locahost auth failed nese kodi eshte gabim
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      // metoda sing() sebashku me jwt, krijon nje token per cdo user qe behet login, per te mbajtur informacionin te fshet si ne database si ne html
      const token = jwt.sign( //If we make it past that if block, I know that we do have a valid password though, so this is where I want to continue and create this Json Web Token
        { email: fetchedUser.email, userId: fetchedUser._id }, // regjistrojme email dhe id qe ndodhet ne database
        "secret_this_should_be_longer", // kjo krijon kodin e madhe kjdlkfjadflkjadfjlkdjfkjadf
        { expiresIn: "1h" }// e bejme application akoma me te sigur, par kur user e haroh hapun application ai mbas nje ore mbullet atomatikisht, dhe duhet ta besh prap login qe te hapet, ne te kundert nuk hapet.
      );
      res.status(200).json({ // na mundeson te kalojme informacione ne angular nga http
        token: token,
        expiresIn: 3600,// 3600 milisekonda, mbas 3.6 sekonda mbyllet application
        userId: fetchedUser._id //  userId qe kena krijuar duam ta traferojme ne angular nga ketu
      });
    })
    .catch(err => { // nese ka error te te gjith funksoneve me siper persei informojme user ne localhost Auth failed
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
});



module.exports = router; // pasi te gjitha metodat i lidhim me nje router, po nga ky router ne i exportojme keto metoda te app.js i cila na lejon te perdorim keto metoda. Gjithashtu na ben te mundur lidhjen me database ose ndyshe mongodb.
