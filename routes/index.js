const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./auth');
const Pro = require('../models/Pro');
const User = require('../models/User');

router.get('/',(req,res)=>res.render('index'));

router.get('/dashboard',ensureAuthenticated,(req,res)=>
{
   User.find().then((docs)=>res.render('dashboard',{name:req.user.name,pros:docs}));
   
}
);


module.exports = router;