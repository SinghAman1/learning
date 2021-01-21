  const Campground = require('../models/campground') 
  const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
  const { cloudinary } = require("../cloudinary"); 


 module.exports.index = async (req,res)=>{ 
    const ca= await Campground.find(); 
    res.render('campgrounds/index',{ca})
 } ;  

module.exports.renderNewForm =(req,res)=>{  
    res.render('campgrounds/new'); }

module.exports.showPage = async (req,res)=>{  
    const{id} = req.params;
    const ca= await Campground.findById(id) 
    .populate({ 
         path:'reviews' , 
         populate: { 
             path:'author'
         }
       }) 
    .populate('author'); 
   //  console.log(ca) ;
     if(!ca) { 
         req.flash('error', ' campground not found')
        return res.redirect('/campgrounds');
     }
    res.render('campgrounds/show',{ca})
 } 

module.exports.createdNew =  async(req,res,next)=>{   
    
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`) 
  } 

module.exports.rendereditform =async ( req,res) =>{ 
    const{id} = req.params; 

    const ca= await Campground.findById(id); 
    if(!ca) { 
        req.flash('error', ' campground not found')
       return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/edit',{ca}) 
} 

module.exports.formedited = async  (req,res)=>{   
    const { id } = req.params;
    // console.log(req.body);  
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();   
    // console.log(campground);  
    if (req.body.deleteImages) { 
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    //    console.log(campground); 
    } 
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    
} 

module.exports.deletecamp =async  (req,res)=>{  
    const{id} = req.params;
    const ca= await Campground.findByIdAndDelete(id);  
    req.flash('success', 'campground deleted successfully')
    res.redirect(`/campgrounds`);
//  res.send('it worked'); 
}

