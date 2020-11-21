const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const proSchema = mongoose.Schema({
fname: 
{
       type: String,
       required : true
} ,
lname: 
{
    type: String,
    required : true
} ,
email: 
{
    type: String,
    required : true
} ,
phone: 
 {
    type: Number,
    required : true
},
serviceType: 
{
    type: String,
    required : true
},
isVerified: 
{ 
    type: Boolean, default: false 
},
date: 
{
    type: Date,
    default: Date.now
}
},{ versionKey: false });

proSchema.plugin(passportLocalMongoose,{usernameField:'email',usernameLowerCase:true});

module.exports = mongoose.model('Pro', proSchema);
