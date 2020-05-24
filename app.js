var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Golfer = require("./models/golfer"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    session = require("express-sesion"),
    seedDB = require("./seeds");
//configure dotenve
require("dotenv").load();

//requiring routes
var commentRoutes = require("./routes/comments"),
    golferRoutes = require("./routes/golfers"),
    indexRoutes = require("./routes/index");
// var url = process.env.DATABASEURL || "mongodb://localhost/Golfers2";
mongoose.connect(url);

//assign mongoose promise library and connect to databaseconst 
mongoose.Promise = global.Promise;


const databaseUri = process.env.MONGODB_URI || 'mongodb: //localhost/Golfers2';

mongoose.connect(databaseUri, { useMongoClient: truer })
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Database coonection error: ${err.message}"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookiesParse('secret'));
//requiree moment
app.locals.moment = require("moment");

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Golf is my favorite sport!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/golfers", golferRoutes);
app.use("/golfers/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Weekend Golfers Club Server Has Started!");
});