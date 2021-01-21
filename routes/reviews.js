const express = require('express'); 
 const  router = express.Router( {mergeParams:true }); 

const Campground = require('../models/campground'); 
const Review = require('../models/review'); 
const catchAsync = require('../utils/catchAsync')  

const {isloggedin , isreviewAuthor , validatereview} = require('../middleware')

const review = require('../controllers/review')

router.post('/', isloggedin, validatereview, catchAsync(review.reviewadd) ) 


router.delete('/:reviewId',isloggedin,isreviewAuthor, catchAsync(review.reviewdelete) ) 

module.exports=router;