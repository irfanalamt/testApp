const mongoose = require('mongoose');

const proSchema = mongoose.Schema({
   fname: {
       type: String,
       required : true
   } ,
   lname: {
    type: String,
    required : true
} ,
email: {
    type: String,
    required : true
} ,
 phone: {
    type: Number,
    required : true
},
serviceType: {
    type: String,
    required : true
},
date: {
    type: Date,
    default: Date.now
  }
},{ versionKey: false });


const Pro = mongoose.model('Pro', proSchema);

module.exports = Pro;