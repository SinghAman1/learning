const Campground = require('./models/campground');  
const Review = require('./models/review'); 
const {campgroundschema, reviewschema}= require('./schemas.js') ; 
const expressErr= require('./utils/expressErr');


module.exports.isloggedin =(req,res,next) =>{  
   if(!req.isAuthenticated()) { 
    req.session.returnTo= req.originalUrl;
    req.flash('error', 'first signed in') 
    return  res.redirect('/login');
  }   
  next();
} 


module.exports.isAuthor = async (req,res,next)=>{  
   const{id} = req.params;
  const ca= await Campground.findById(id); 
  if(!ca.author.equals(req.user._id)) { 
     req.flash('error', 'you donot have permission to do that')  
    return res.redirect(`/campgrounds/${id}`);   
  }  
  next(); 

}  


module.exports.isreviewAuthor = async (req,res,next)=>{  
  const{ id ,reviewId} = req.params;
 const re= await Review.findById(reviewId); 
 if(!re.author.equals(req.user._id)) { 
    req.flash('error', 'you donot have permission to do that')  
   return res.redirect(`/campgrounds/${id}`);   
 }  
 next(); 

} 

module.exports.validatecamp =(req,res,next)=> { 
   
  const {error}=  campgroundschema.validate(req.body)  
   if(error) { 
    const mess= error.details.map(el => el.message).join(',') 
    throw new expressErr(mess,400)
   } 
   else {  
     next();
   }
 }  

 
module.exports.validatereview= (req,res,next)=> {
  const{ error} = reviewschema.validate(req.body) 
   if(error ) { 
   const mess= error.details.map(el => el.message).join(',') 
    throw new expressErr(mess,400)
   }
   else { 
    next();
   }
}