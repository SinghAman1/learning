
 const Review = require('../models/review');
 const Campground = require('../models/campground');

 module.exports.reviewadd = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.reviewdelete =  async(req,res)=>{ 
    const{ id, reviewId} = req.params;
  const  cam = await Campground.findByIdAndUpdate(req.params.id, {$pull:{reviews:reviewId}}); 
 await Review.findByIdAndRemove(req.params.reviewId); 
  req.flash('success' , ' review deleted successfully !')
 res.redirect(`/campgrounds/${cam._id}`)    
 
 }