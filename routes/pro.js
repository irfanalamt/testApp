const express = require('express');
const router = express.Router();

const Pro = require('../models/Pro');


router.get('/becomePro',(req,res)=>res.render('registerPro'));
router.get('/loginPro',(req,res)=>res.render('loginPro'));

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
        errors.push({msg:'Registration Successful!'});
        res.render('registerPro',{errors,fname,lname,email,phone,serviceType});

        }).catch(err=>console.log(err));
        res.redirect('/pro/becomePro');
    }
});




});




module.exports = router;