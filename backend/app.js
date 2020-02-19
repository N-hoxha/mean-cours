// npm run start:server

// npm install --save express
// npm install --save mongoose
const express = require("express"); // pastaj inportojme librarin express
const bodyparser = require("body-parser") // therasim librarin body-parser
const app = express(); // e therasim si funksion
const postsRoutes = require("./routes/posts"); // therasim posts.js
const userRoutes = require("./routes/user"); // therasim user.js
const path = require("path");

// GmjIG1guMXlXfGg9 password i mongoDB
// libraria mongoose te cilen e kena istaluar eshte nje librari e mongodb e cila sherben per te lidhur nje server NodeJS me nje database mongodb
const mongoose = require("mongoose"); // inportojme librarin mongoose

// kete linke e marim nga mongodb ne internet dhe te trasferojme ketu, ndersa nqOV3tAUxiKGSDRE eshte passwordi
// ne linkur qe lidh mongodb me nodejs kena shtur nje node-angular, per arsye se me database te punojme edhe ne terminal
//SHENIM: PAS SI KRIJOME NJE USER SERVER PER TE MAR EMAIL DHE PASWORDS NE MUND TE NA DUHET NJE MODIFIKIM NE LINKUN E LIDHEJES ME MONGODB KU NGA "mongodb+srv://max:tR6aMl5EOHHcVFcN@cluster0-b3np1.mongodb.net/test?retryWrites=true" NA DUHET TE SHTOJME BRENDA KLLAPAVE { useCreateIndex: true, useNewUrlParser: true }, PER TE SHMANGUR ERORIN.
// OSE NESE NXJER PERSERI ERROR NGA mongodb+srv://max:tR6aMl5EOHHcVFcN@cluster0-b3np1.mongodb.net/test?retryWrites=true
// DUHET BERE mongodb+srv://max:tR6aMl5EOHHcVFcN@cluster0-b3np1.mongodb.net/node-angular KESHTUR
// NESE BLLOKOHET PORTA DHE ME DEL Connected failed! ATERE DUHET BERE Sudo service mongod restart
mongoose.connect("mongodb+srv://mean-cours:GmjIG1guMXlXfGg9@cluster0-tz3ik.mongodb.net/test?retryWrites=true&w=majority",
                  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
.then(() => { // Dhe e kontrollojme nese ka error apo jo
  console.log("Connected to database!");
})
.catch(() => { // catch perfaqeson nje error ose nje null
  console.log("Connected failed!")
});



// ------------------- body-parser ------------------
//per te lexuar te dhenat nga HTTP POST de na duhet te installojme nje librari e expressit me emrin bodyparser i cili ben te mundur leximin e nje input FORM dhe e regjistron ate ne JAVASCREAP OBJECT.

// NODEJS mer sinjalin nga app.use i cili, bashkon dy localhostet 4200 dhe 3000 me ndimen e http, ku keto sinjale drejtohen te metodat get, post, put, delete etj. Ku keto metoda per momentin ne nodejs nuk egzitojne, ku egziston vetem ( app.use("/api/posts", (req, res, next) ), te cilin me pas, pasi te kena instaluar librarin body-parser e kthjme ne ( app.get("/api/posts", (req, res, next) ).
// Lind pyetja, pse dikur ka qen nje app.use dhe tashi nje app.get?
// Sepse nodejs te gjitha informacione qe mer nga http, ose database dhe anasjellat, i bej objekte JSON, ku ben te mundur kalimin nga klienti te server, nese nodejs nuk do i kalonte dot keto informacione ne objecte JSON, klienti nuk do lidhesh dot me serverin. Ne metodat GET, PUT, POST, DELETE ejt, edhe nuk mund ti shkruje (app.get, app.put psh) por ti shkrujme (app.use, app.use), por ato do karamboloheshin nese ne nodejs do kishte 2 ose me shum medota, sepse nuk do mereshin vesh kush ishte get, post, put, ose delete, prandaj ne instalojme nje librari body-parser, i cili ben te mundur qe informacionin nga klienti ne server ta kthej ne objekt JSON. Dhe ne nuk kena me nevoje per metoden app.use por app.get ose app.use kthehet ne app.post .

//-------------------------------------------------------
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images"))); // const path = require("path"); pa shtuar kete dhe funksonin perbri fotoja nuk regjsitohet as ne foldrin images, as ne database mongodb. Pra nuk punon fare as nje funksion pa kete qofte funksioni ne angular gjofte ketu ne express.

// lidh dy localhost, localhost i Angularit 4200 dhe localhost i NodeJS 3000
// Pa kete nuk mund te lidhen dot dy servera.
// na ndiomn qe metodat post dhe get ketu ne app.js te punoj sic duhet pa gabime
// gjithashtu na ndimon qe request dhe responsejson te punojne ne menure me te mir te mucme
app.use((req, res, next) => { // res ose ndyshe response dote thot qe po kethen pergjigje angularit



  // Para se te vim ketu kena nje problem, serveri i nodejs eshte localhost 3000, ndersa serveri i client ose angular eshte 4200, keshtu ata nuk mund te lidhen dote bashke per te mar dhe dhen informacione, keshtu qe modifikojme serverin duke ndertuar nje server API(I cili ben te mundur komunikimin e librarive te ndryshme qe i therasim dhe mjetet per te ndertuar software nga subroutine(URL OSE LOCALHOST OSE NDRYSHE logjika se si punon app-routing ne angular )), per tu lidhur me klientin. Venja ne pun e kesaj makinere ose application edhe pse ka probleme me localhost te ndyshme eshte duke vendosur kohen e duhur(setHeader) ne pergjigjet(res, response) ansore te serverit, ku ne fund i jep next().

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // gjithashtu ma headers Authorization nuk mundesh te besh dot singup dhe login.
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" // pa keto metoda as nje metode ne angular dhe nodejs si get, put, post, dhe delete nuk munon
  )
  next(); // next do te thote ne nodejs -> return
});

// te dyja keto funksone te njejta na mundesojne qe file posts.js dhe user.js te perdorin metodat get, post, patch, put, delete dhe options.
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

// ndyshe ne angular eshte expor implement class app {}
module.exports = app; // informacionin qe kena ketu duam ta trasferojme te server.js
