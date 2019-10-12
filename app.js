var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Golfer = require("./models/golfer"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    var Port = process.env.PORT || 3000;
//requiring routes
var commentRoutes    = require("./routes/comments"),
    golferRoutes     = require("./routes/golfers"),
    indexRoutes      = require("./routes/index");
// var url = process.env.DATABASEURL || "mongodb://localhost/Golfers2";
// mongoose.connect(url) ;
//mongoose.connect("mongodb://<username>:<password>@ds311538.mlab.com:11538/heroku_79xr3x52");

      DATABASE_NAME = 'Golfers2',
      mongoURI = `mongodb://localhost:27017/${DATABASE_NAME};`
    
//Set up promises with mongoose
mongoose.Promise = Promise; 
//if there's a shell environment variable named MONGODB_URI (deployed), use it; otherwise, connect to localhost
const dbUrl = process.env.MONGODB_URI || mongoURI;
// mongoose.connect(MONGOLAB_URI || mongoURI, { useNewUrlParser: true });
mongoose.connect(dbUrl, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Golf is my favorite sport!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/golfers", golferRoutes);
app.use("/golfers/:id/comments", commentRoutes);




 app.listen(process.env.PORT, process.env.IP, function(){
     console.log("Weekend Golfers Club Server Has Started!");
  });

