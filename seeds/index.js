const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

 const seedDB = async ()=>{ 
      await Campground.deleteMany({}); 
     for(let i=0;i<10;i++) {  
         const rand= Math.floor( Math.random()*1000) ;
         const price= Math.floor( Math.random()*20)+10 ;

      const c = Campground({  
        //   location: `${cities[rand].city} , ${cities[rand].state}` , 
        location: `${cities[rand].city}, ${cities[rand].state}`,
           title : `${sample(descriptors)}  ${sample(places)}` ,  
           //your user id
           author :"60033e643d4b911cc0dbc4a8",  
           geometry: { type: 'Point', 
            coordinates: [ cities[rand].longitude , 
             cities[rand].latitude
             ] },

           images: [
            {
              url: 'https://res.cloudinary.com/amanji/image/upload/v1610977833/YelpCamp/ii_azzpfe.jpg',
              filename: 'YelpCamp/qx2ysuftjcbcpky00h0k'
            }, 
            {
              
              url: 'https://res.cloudinary.com/amanji/image/upload/v1611041517/YelpCamp/pdziuznhvn7crjgb9oes.jpg',
              filename: 'YelpCamp/pdziuznhvn7crjgb9oes'
            }
        
          ],        
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.  ipsam a cum nihil atque molestiae deserunt!', 
           price : price
      }) 
      await c.save();

     }
 } 

 seedDB().then ( ()=>{ 
     mongoose.connection.close();
 })