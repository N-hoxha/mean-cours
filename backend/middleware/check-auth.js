
// Krijome nje funksione jasht cdo lloj klase si app.js, user.js apo post.js. Ky lloj fuksione do lexoj token i cili krijohet pasi cdo user behet login, cdo token krijohet nga libraria jsonwebtoken dhe keyword secret_this_should_be_longer ne klasen user.js, pasi krijohet kur cdo user behet login, ne kete token qe krijohet e kontrollojme ne funksion meposhte qe eshte me verte i njejti token qe krijohet apo eshte nje token tjetet, nese eshte i njejti token qe user eshte futur ne aplication atere i japim next() ose ndryshe return, ne te kundert Auth failed. POR PSE E BEJME KETE FUNKSIONE. Sepse deri ne keta faz ku kena aritur cfare dolloj user futet ne application krijon posta, i fshin ato, i ben edit, pra ben cfar do lloj gjeje me to. Pra kjo nuk eshte normale. Keshtuqe krijome nje barajere, nje mur, nje siguri, qe keto posta, te krijohet, te behet edit ose update, apo te fshihetn vetem nga useri qe i ka krijuar ato. Keshtu qe useri pasi eshte bere login, krijohet nje token, token qe eshte krijuar kontrollohet ne funksionin me poshte, qe eshte i njejti token apo jo, pasi e vertetojme qe eshte i njejti, e zhvendosim informacionin te post.js me emrin checkAuth. checkAuth e marim dhe e shtojme ne create post ose (post), delete post dhe put post(update ose delete), nese token nuk krijohet, ose nese nje user nuk do te behet login, user ka akses vetem te get(pa id ) dhe get(id), pra te shofi listat e postave, dhe posta me radhe cfare kan brenda, ndersa per te krijuar nje poste, per ti bere update ose edit, apo delete nuk ka aksese spese nuk eshte bere login.

// pra token na hun ne pun per te rujtur informacionin e userit_X dhe useri_Y te mos kete akses te shofi informacionet e userit_X, vetem te vetat (useri_Y)

const jwt = require("jsonwebtoken");

// e vendosim ne module.export per arsyse se kete funksione duma ta drasferojme diku tjeter
module.exports = (req, res, next) => {
  try { // try eshte i ngjashem me if () { } else
    // get the token from the incoming request and store it in this constant.
    //pse behet req(request) sepse po marim nje informacion nga angulari, i cili ky infromacion eshte nje token, i krijuar ne user.js.
    const token = req.headers.authorization.split(" ")[1];

    // token qe mmarim e verifikojme nga libraria jsonwebtoken dhe nga keyword secret_this_should_be_longer nga e cila ne ne user.js krijom token per cdo user qe behet login.
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer"); // pasi verifikohet token qe krijohet kur behesh login. e verifikojme edhe nje here kete token, qe eshte i njej me token qe eshte krijuar kur user eshte bere login, ku te ket akses per te par posta qe user ka krijuar vete dhe te ket akses ne update dhe delete, ne te kundert nese nuk eshte e njeta token useri nuk ka akses as per update as per delete por vetem per ti par keto posta, sepse nuk ka te njej token. Nje token perfaqeson nje userId unik, nje email unik, te cilat regjistrohen ne database, therit ketu per tu ferifikuar, dhe percillen ne posts.js nese eshte e njejta token apo jo, ne te kundert null.
    // si email dhe userId jan te bashkuar ne nje token(kasjdkfjoajdfljadsfjlkkadjfjasdfjlskdfjldjf), ne kete lloj mebyre per sigurin e cdo useri.
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }; // nga decodedToken marim driten jeshile dhe bashkagjisim email(test2@test.com) e userit dhe userId(4KJLKFJLG88KJDKJL) i cili ben unike cdo user nga njeri tjetri nga i cili eshte krijuar ne user.js, ku krijojme dhe token. Dhe te dyja keto informacione qe ne i therasim nga user.js i bashkagjisim ne req.userData.
    // Por pse req para userData? Sepse req na mundeson ta trasferojme keto dy infromacione ne nje vend tjeter si posts.js
    next(); // eshte ne vend te return

  } catch (error) { // else | response ne web consule nese ka gabime
    res.status(401).json({ message: "You are not authenticated!" }); // mesazhi do shfaqet ne consule.log
  }
};

