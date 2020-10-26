const express = require('express');
const app = express();
const PORT = process.env.PORT|| 5000;
var path = require("path");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./passport')(passport);

//logger
const logger = (req,res,next)=>{
    console.log(`${req.protocol} ||  ${req.path}`);
    next();
};
app.use(logger);

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));


//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'));
app.use('/pro',require('./routes/pro'));

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
