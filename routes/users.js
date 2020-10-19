const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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
                    const newUser = new User(
                        {
                            name,email,password
                        }
                    );
                    
                    //password hashing
                    bcrypt.genSalt(10, (err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user =>{
                          req.flash('success_msg','You are registered now. Please Login.');
                          res.redirect('/users/login'); 
                        })
                        .catch(err=>console.log(err));

                    }))

                }
            }
        )



       
    }

}) ;

module.exports = router;
