const express = require('express'); 
 const  router = express.Router(); 

 const catchAsync = require('../utils/catchAsync') 
 
 const campgrounds = require('../controllers/campground')

 const expressErr= require('../utils/expressErr');
 const Campground = require('../models/campground'); 
const {isloggedin , isAuthor , validatecamp} = require('../middleware')


const  multer  = require('multer') 
const  {storage}  = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
   .get(catchAsync(campgrounds.index ) )
   .post(isloggedin , upload.array('image') , validatecamp , catchAsync(campgrounds.createdNew)  )      
  
router.get('/new',isloggedin,campgrounds.renderNewForm)   

 router.route('/:id')
      .get( catchAsync( campgrounds.showPage ) )
      .put( isloggedin,isAuthor,upload.array('image'),  validatecamp, catchAsync( campgrounds.formedited )) 
      .delete(isloggedin,isAuthor, catchAsync( campgrounds.deletecamp ))  

router.get('/:id/edit', isloggedin, isAuthor,  catchAsync( campgrounds.rendereditform) )


 module.exports= router;