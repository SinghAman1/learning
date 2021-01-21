 const mongoose =require('mongoose'); 
 const Review =require('./review'); 
 const Schema = mongoose.Schema; 
 
 const imageschema = new  Schema({  
  
    url:String,
    filename:String
  
 })
 imageschema.virtual('thumbnail').get(function (){ 
   return this.url.replace('/upload','/upload/w_200');
 });
 
 const opts = { toJSON: { virtuals: true } };

 const campgroundsachema= new Schema({ 
   title: String,  
   images:[ imageschema ],  
   geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    } 
   },
   price: Number, 
   description:String, 
   location: String,  
   author:  { 
      type:mongoose.Schema.Types.ObjectId, 
      ref:'User'
   } ,
   reviews: [
     { 
       type: mongoose.Schema.Types.ObjectId, 
       ref:'Review'
     }
   ]
 } , opts);  


campgroundsachema.virtual('properties.popUpMarkup').get( function () {
 return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
 <p> price/night :$${this.price}</p>`
});
  
 campgroundsachema.post('findOneAndDelete', async function (camp) { 
    if( camp) { 
   await Review.deleteMany({ 
     _id: {
        $in: camp.reviews
     }
   })
    } 
    
 })

 module.exports = mongoose.model('Campground',campgroundsachema);
