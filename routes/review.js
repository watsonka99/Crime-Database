// created by Kieran Watson

const express = require("express"),
router  = express.Router(),
People = require("../models/people"),
transaction = require("../models/transaction"),
Review = require("../models/review");

const { ensureAuthenticated, ensureSecured, ensureIM } = require('../config/authenticated');

function checkbox(input){
    if (input == "1") {
        return true
     } else {
        return false
     }
}

// new
router.get("/people/:PeopleID/review/new",ensureAuthenticated, ensureSecured, ensureIM, function(req, res) {
    res.render("peoples/review", {personID: req.params.PeopleID});
});

// create
router.post("/people/:PeopleID/review",ensureAuthenticated, ensureSecured, ensureIM, function(req, res){
    People.findById(req.params.PeopleID, function(err, foundPerson){
        if (err) {
            console.log(err)
            req.flash("error_msg", "unable to get create review at this current moment")
            res.redirect("back")
        } else {
            Review.create({
                harm: checkbox(req.body.harm),  
                children: checkbox(req.body.children),
                trust: checkbox(req.body.trust),
                associations:  checkbox(req.body.associations),
                substance:  checkbox(req.body.substance),
                mentalState:  checkbox(req.body.mentalState),
                impact:  checkbox(req.body.impact),
                interest:  checkbox(req.body.interest)
            }, function(error, newReview){
                if(error){
                    console.log(error)
                    req.flash("error_msg", "unable to get create review at this current moment")
                    res.redirect("back")
                } else {
                    foundPerson.reviews.push(newReview);
                    foundPerson.reviewed = new Date();
                    foundPerson.save();
                    transaction.create({
                        CarriedOutBy: {
                            id: req.user._id,
                            email: req.user.email},  
                        action: "CREATE",
                        database: "Review",
                        reference: newReview._id
                    });
                    req.flash("success_msg", "Review "+newReview._id +" has been added")
                    res.redirect("/people/"+ req.params.PeopleID );
                }
            });
        }
    });
});

//show
router.get("/people/:PeopleID/review/:reviewID",ensureAuthenticated, ensureSecured, ensureIM, function(req, res) {
    Review.findById(req.params.reviewID, function(err, foundReview){
        if (err){
            console.log(err);
            req.flash("error_msg", "unable to get load review, "+req.params.reviewID +" at this current moment")
            res.redirect("back");
        } else {
            res.render("peoples/showReview", {review: foundReview, personID: req.params.PeopleID});
        }
    });
});

module.exports = router;