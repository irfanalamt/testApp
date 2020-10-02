const express = require('express');
const app = express();
const PORT = process.env.PORT|| 5000;
var path = require("path");
//const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

//logger
const logger = (req,res,next)=>{
    console.log(`${req.protocol} ||  ${req.path}`);
    next();
};
app.use(logger);

app.use(expressLayouts);
app.set('view engine','ejs');

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'));

app.use(express.static(path.join(__dirname,'public')));

// mongoose.connect('mongodb://localhost/handyme', {useNewUrlParser: true});
// const Schema = mongoose.Schema
// const userSchema = new Schema({
// name : String,
// pass : String
// });

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
