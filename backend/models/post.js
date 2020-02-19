
const mongoose = require('mongoose'); // ketu theret librarin

// vem re ne angular string fillon me s-ja me shkrojne te vogel, dersa ketu ne JS fillon me shkronje te madhe.
//  required: true, pra inputi nuk eshte bosh, duhet te jet plot
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId,  ref: "User", required: true} // going to be information about who created this post, i cili perfaqeson ID per cdo USER, QE KA AKAUNTIN E VET.
});

module.exports = mongoose.model("Post", postSchema); // na lejon ta exportojme diku tjeter
