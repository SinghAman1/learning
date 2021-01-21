const express = require('express'); 
const passport = require('passport');
 const  router = express.Router(); 
 const User = require('../models/user') ;
 const catchasync = require('../utils/catchAsync');

const user = require('../controllers/user')   

router.route('/login')
    .get(user.loginform)  
    .post( passport.authenticate('local', {failureFlash:true , failureRedirect:'/login'}), user.login) 
 
router.route('/register') 
     .get(user.register ) 
     .post ( catchasync(user.adduser) ) 

router.get('/logout',user.logout)

 module.exports= router;