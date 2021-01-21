const User = require('../models/user') ; 

module.exports.register =  (req,res)=>{ 
    res.render('users/register');
} 

module.exports.adduser = async (req,res)=>{  
    try{
   const { username, email ,password} = req.body;
   const  newUser =   new User ({ username , email}); 
    const regUser= await User.register(newUser, password); 
    req.login(regUser ,err=>  { 
        if( err) return next(err); 
        req.flash( 'success','welcome to yelp-camp');
        res.redirect('/campgrounds');  
    });
  } 
   catch(e) { 
      req.flash('error' ,e.message)  
    res.redirect('/register');
   }
} 

module.exports.loginform = (req,res)=>{ 
    res.render('users/login')
} 

module.exports.login =async(req,res)=>{ 
    req.flash('success', 'welcome back') 
     const currentpath = req.session.returnTo || '/campgrounds'; 
     delete req.session.returnTo;
 res.redirect(currentpath);

} 

module.exports.logout = (req,res)=>{ 
    req.logout();  
    req.flash('success','successfully logged out')
    res.redirect('/campgrounds');
}