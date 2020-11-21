const express = require('express');
require('dotenv').config()
const router = express.Router();

//models
const TokenPro = require('../models/TokenPro');
const Pro = require('../models/Pro');

var nodemailer = require('nodemailer');

const {ensureAuthenticatedPro} = require('./auth');

router.get('/becomePro',(req,res)=>res.render('registerPro'));
router.get('/loginPro',(req,res)=>res.render('loginPro'));

router.get('/dashboard',ensureAuthenticatedPro,(req,res)=>res.render('dashboardPro'));

router.post('/login',(req,res)=>{
const {password,email} = req.body;

console.log(`${email} ${password}`);

});

router.post('/register',(req,res)=>{
const {fname,lname,email,phone,serviceType} = req.body;
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
        newPro.save().then(pro=>{
            var rand= Math.floor((Math.random() * 100) + 54);
            var token = new TokenPro({_proId:pro._id,token:rand});
            token.save((err)=>
            {
                if (err) throw err;

               
                var link="http://"+req.get('host')+"/verify?id="+rand;
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
                    to : pro.email,
                    subject : 'HandyME Email Confirmation',
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
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




module.exports = router;