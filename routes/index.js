const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>res.render('index'));
router.get('/loginPage',(req,res)=>res.render('login'));



module.exports = router;