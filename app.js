const express = require('express');
const app = express();
const PORT = process.env.PORT|| 5000;
var path = require("path");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

//logger
const logger = (req,res,next)=>{
    console.log(`${req.protocol} ||  ${req.path}`);
    next();
};
app.use(logger);

app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));

//session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'));

app.use(express.static(path.join(__dirname,'public')));

//DB 
const conn = mongoose.connect('mongodb://localhost/handyme', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
