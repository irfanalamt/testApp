const express = require('express');
require('dotenv').config()
const router = express.Router();
const passport = require('passport');
var randomBytes = require('randombytes');

//models
const TokenPro = require('../models/TokenPro');
const Pro = require('../models/Pro');

var nodemailer = require('nodemailer');

const {ensureAuthenticatedPro} = require('./auth');

var ensureVerified=(req,res,next)=>
{
    let userEmail = req.body.email;
    Pro.findOne({email:userEmail},(err,doc)=>
    {
        if (err) throw err;

        if(!doc){
            req.flash('error_msg', 'User NOT found');
            res.redirect('/pro/loginPro');
        }

        else if (doc.isVerified==true)
        {
        console.log('EnsureVerified()==true')
        next();
        }

        else{

            req.flash('error_msg', 'Account NOT verified.');
            res.redirect('/pro/loginPro');
      
        }

      
    });
}

router.get('/resetpw',(req,res)=>
res.render('resetPass',{name:req.user.name}));

router.post('/resetpw',(req,res)=>
{   
    const {pass1,pass2} = req.body;
    console.log(`${pass1},${pass2}`);
    //todo input validation
    let errors = [];

    Pro.findOne({email:req.user.email},(err,doc)=>
    {   
        if (err)
        {   console.log("Error getting the doc for pwreset ")
            throw err;
        }

        doc.setPassword(pass1,(err,doc)=>
       { doc.save();}
        );
        

    });
});

router.get('/becomePro',(req,res)=>
{   
    
    res.render('registerPro')
}
);
router.get('/loginPro',(req,res)=>res.render('loginPro'));

router.get('/verify',(req,res)=>{
    var currentSearchString = req.query.id;
    console.log(currentSearchString);
    TokenPro.findOne({token:currentSearchString},(err,doc)=>
    {
        if (err) throw err;

        if(!doc)
         { 
           req.flash('error_msg','Token invalid or expired!');
           res.redirect('/pro/loginPro');
         }

        else{
            Pro.findOne({_id:doc._proId},(err,doc)=>
        {
            if (err) throw err;

            if(!doc)
            { 
                req.flash('error_msg','No pro found with matching token.');
                res.redirect('/pro/loginPro');
              }

            if(doc.isVerified) {
                req.flash('success_msg','Email already verified. Please Log in.');
                res.redirect('/pro/loginPro');
            }

            doc.isVerified = true;
            doc.save().then(console.log(doc.fname+' isVerified!')).catch((err)=>console.log('couldnt set isVerified'+err));
            req.flash('success_msg','Email verification successful. Please Log in to continue.');
            res.redirect('/pro/loginPro');

        });}

    });
});

router.get('/dashboard',ensureAuthenticatedPro,(req,res)=>res.render('dashboardPro',{name:req.user.name}));

router.post('/login',ensureVerified,
  passport.authenticate('local',
{ 
    successRedirect: '/pro/dashboard',
    failureRedirect: '/pro/loginPro',
    failureFlash: true 
})
);

router.post('/register',(req,res)=>{
const {fname,lname,email,phone,serviceType} = req.body;
var tempNum = Math.floor(Math.random() * 10000)+1; 
var tempPass = 'HMpro'+tempNum;
console.log(tempPass);
let errors = [];
Pro.findOne({email:email},(err,pro)=>
{
    if(err) throw err;

    // pro exists in DB
    if(pro)
    {
        errors.push({msg:'Email is already registered.' });
        res.render('registerPro',{errors,fname,lname,email,phone,serviceType});
    }
    else
    {
        const newPro = new Pro({
            fname,lname,email,phone,serviceType
        });
        Pro.register(newPro,tempPass).then(pro=>{
            //var rand= Math.floor((Math.random() * 100) + 54);
            var rand = randomBytes(8).toString('hex');
            console.log('rand = '+rand);
            var token = new TokenPro({_proId:pro._id,token:rand});
            token.save((err)=>
            {
                if (err) throw err;

               
                var link="http://"+req.get('host')+"/pro"+"/verify?id="+rand;
                var smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: 
                    {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                    }
                });
                mailOptions=
                {   host: 'smtp.gmail.com',
                   // to : pro.email,
                    to: 'irfanalamt@gmail.com',
                    subject : 'HandyME Email Confirmation',
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br>Your temporary password is <h3>"+tempPass+"</h3>"
                }
                console.log(mailOptions);

                smtpTransport.sendMail(mailOptions,(err,info)=>{
                    if(err) console.log(err);

                 else{
                        console.log("Message sent! \n" + JSON.stringify(info));
                        
                     }
                });

            });
        req.flash('success_msg','Confirmation email sent to '+pro.email+' .Verify email to complete registration.');
        res.redirect('/pro/becomePro');

        }).catch(err=>console.log(err));
        
    }
});
});


router.get('/logout',(req,res)=>
{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/pro/loginPro');
});

module.exports = router;