const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/login',(req,res)=>res.render('login'));
router.get('/register',(req,res)=>res.render('register'));


router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;
    
    
    let errors = [];

    if(!email||!password)
    {
        errors.push({msg:'Please fill in all fields.'});
    }
    if(password!=password2)
    {
        errors.push({msg:'Passwords dont match.'})
    }

    if(password.length < 6)
    {
        errors.push({msg:'Password should be atleast 6 characters.'});
    }

    if(errors.length>0)
    {
        res.render('register',{name,errors,email,password,password2});
    }else { 
        //Validation passed

        User.findOne({email:email}).then(
            user=>{
                if(user)
                { //User exists in DB
                    errors.push({msg:'Email is already registered.' })
                   res.render('register',{
                       errors,name,email,password,password2
                   });  

                }
                else{
                    const newUser = new User({name,email});
                    
                    User.register(newUser,req.body.password,(err,user)=>{
                      if(err) console.log(err); 
                      else {
                        req.flash('success_msg','You are registered now. Please Login.');
                        res.redirect('/users/login'); 
                      }
                    });
                    
                    
                   

                    

                }
            }
        )



       
    }

}) ;

// router.post('/login',(req,res,next)=>{
// passport.authenticate('local',{
//     successRedirect:'/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true
// })(req,res,next);
// });

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/logout',(req,res)=>{
req.logOut();
req.flash('success_msg','You are logged out');
res.redirect('/users/login');
});

module.exports = router;
