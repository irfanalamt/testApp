const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT|| 5000;
var path = require("path");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

//models
const User = require('./models/User');
const Pro = require('./models/Pro');

//require('./passport')(passport);

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
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url:process.env.DB_STRING }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
}
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(Pro.createStrategy());
passport.serializeUser(Pro.serializeUser());
passport.deserializeUser(Pro.deserializeUser());

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
app.use('/',require('./routes/index.js'))
app.use('/users',require('./routes/users.js'));
app.use('/pro',require('./routes/pro.js'));

app.use(express.static(path.join(__dirname,'public')));

//DB 
const conn = mongoose.connect('mongodb://localhost/handyme', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connection successful.'))
.catch(err => console.log(err));


app.listen(PORT,()=>console.log(`Express Server started on port ${PORT}`));
