if( process.env.NODE_ENV !== "production")  { 
    require('dotenv').config();
}
 
//mongodb+srv://aman_123:<password>@cluster0.ta7zw.mongodb.net/<dbname>?retryWrites=true&w=majority

const express= require('express'); 
const app= express();  
const session= require('express-session'); 
const mongoose =require('mongoose');  
const ejsmate = require('ejs-mate');
const methodoverride= require('method-override'); 
const flash= require('connect-flash'); 
const path= require('path'); 
 const  passport = require('passport') 
 const localstrategy = require('passport-local')
 const mongoSanitize = require('express-mongo-sanitize');
 const helmet = require("helmet");
 // errors
const expressErr= require('./utils/expressErr'); 
const catchAsync = require('./utils/catchAsync') 
//  routes
const campgroundsroutes = require('./routes/campground')
const reviewsroutes = require('./routes/reviews') 
const userssroutes = require('./routes/user') 
 //  models
const User = require('./models/user')  


const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useFindAndModify:false
}); 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); 

app.engine('ejs',ejsmate);
app.set('view engine', 'ejs')  
app.set('views',path.join(__dirname,'views'))  

app.use(express.urlencoded({extended:true}));  
app.use(methodoverride('_method')); 
app.use(express.static(path.join(__dirname,'public')))    
app.use(mongoSanitize({
    replaceWith: '_'
})) 
 

const secret = process.env.SECRET || 'sss' ;

const store = new MongoDBStore({
    url: dbUrl,
    secret:secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {   
    store,
    name:'_aakkssiinngghh',
    secret:secret ,
    resave:false, 
    saveUninitialized: true,  
    cookie: {  
        httpOnly:true, 
        // secure:true,
         expires: Date.now()+1000*60*60*24*7, 
         maxAge: 1000*60*60*24*7
    }
}  

app.use(session( sessionConfig )) ;
app.use(flash());   
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com", 
    "https://res.cloudinary.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com", 
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com", 
   "https://res.cloudinary.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/amanji/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
 

app.use(passport.initialize()); 
app.use(passport.session());  
passport.use( new localstrategy( User.authenticate())); 
passport.serializeUser(User.serializeUser()) ;
passport.deserializeUser(User.deserializeUser());


app.use(( req,res,next)=>{ 
//  console.log(req.session); 
    res.locals.currentUser= req.user;
   res.locals.success=  req.flash('success'); 
   res.locals.error=  req.flash('error'); 
   next();
})

app.use( '/campgrounds', campgroundsroutes)
app.use( '/campgrounds/:id/reviews', reviewsroutes)
app.use( '/' , userssroutes)


app.get('/', (req,res)=>{ 
    res.render('home')
}) 

app.all('*', (req,res,next)=>{ 
     next( new expressErr('page not found', 404))
})
 
app.use((err,req,res,next) =>{ 
    const { statusCode=500, message="not found"}= err;
    res.status(statusCode).render('error',{message ,err});
})

app.listen( 3000, function () { 
    console.log('listening to port 3000');
})