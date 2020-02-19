// npm install --save mongoose-unique-validator
// Model na hyn ne pun per te krijuar nje array User ansinkon ne Nodejs ashtu sic bejme ne angular. Ky array asinkron pasi krijohet ate e exportojme ne database mongodb. Ndersa ne angular pasi e krijome nje te dhene ne array asinkron e exportojme ne Nodejs pra ne array User, ku nga ketu ne database mongodb.

const mongoose = require("mongoose"); // ketu theret librarin
const uniqueValidator = require("mongoose-unique-validator"); // kjo librari pasi e kena shkarkuar na mundesojme te krijojme ne database nje ID unike per cdo user, ku mundohet me saktesi qe cdo ID e mare nga database te njet unike.

// meto vem re ne angular string fillon me s-ja me shkrojne te vogel, dersa ketu ne JS fillon me shkronje te madhe.
//  required: true, pra inputi nuk eshte bosh, duhet te jet plot
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true }
});

userSchema.plugin(uniqueValidator); // unique: vendoset per ta lajmerua dhe bllokur(mos lejim e dertimit te user te ri) qe me nje email x i cile eshte ber me pertara singup, pra eshte krijuar nje user x, nuk mundena te krijum po me kete email nje user tjeter sepse ne database cdo email ka nje ID ku vecohen nga njeri tjetrin.

// "User" me kete ndertojme emrin e kesaj modul
module.exports = mongoose.model("User", userSchema); // na lejon ta exportojme diku tjeter


