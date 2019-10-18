var express = require("express");
var router  = express.Router();
var Golfer = require("./models/golfer");
var middleware = require("./middleware");


//INDEX - show all golfers
router.get("/", function(req, res){
    // Get all golfers from DB
    Golfer.find({}, function(err, allGolfers){
       if(err){
           console.log(err);
       } else {
          res.render("golfers/index",{golfers:allGolfers});
       }
    });
});

//CREATE - add new golfers to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to golfers array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newGolfer = {name: name, image: image, description: desc, author:author};
    // Create a new Golfer and save to DB
    Golfer.create(newGolfer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to golfers page
            console.log(newlyCreated);
            res.redirect("/golfers");
        }
    });
});

//NEW - show form to create new golfer
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("golfers/new"); 
});

// SHOW - shows more info about one Golfer
router.get("/:id", function(req, res){
    //find the Golfer with provided ID
    Golfer.findById(req.params.id).populate("comments").exec(function(err, foundGolfer){
        if(err){
            console.log(err);
        } else {
            console.log(foundGolfer);
            //render show template with that golfer
            res.render("golfers/show", {golfer: foundGolfer});
        }
    });
});

// EDIT GOLFER ROUTE
router.get("/:id/edit", middleware.checkGolferOwnership, function(req, res){
    Golfer.findById(req.params.id, function(err, foundGolfer){
        res.render("golfers/edit", {golfer: foundGolfer});
    });
});

// UPDATE GOLFER ROUTE
router.put("/:id",middleware.checkGolferOwnership, function(req, res){
    // find and update the correct Golfer
    Golfer.findByIdAndUpdate(req.params.id, req.body.golfer, function(err, updatedGolfer){
       if(err){
           res.redirect("/golfers");
       } else {
           //redirect somewhere(show page)
           res.redirect("/golfers/" + req.params.id);
       }
    });
});

// DESTROY Golfer ROUTE
router.delete("/:id",middleware.checkGolferOwnership, function(req, res){
   Golfer.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/golfers");
      } else {
          res.redirect("/golfers");
      }
   });
});


module.exports = router;
