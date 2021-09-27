// RESTful routes for crimes pages - Ryan Donnelly

const express = require("express"),
router = express.Router(),
Crimes = require("../models/crimes"),
Transaction = require("../models/transaction"),
Security = require("../security")
Validation = require("../validation"),
People = require("../models/people");

const { ensureAuthenticated, ensureSecured } = require('../config/authenticated');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

function validate(data) {
    if (Validation.validateFirstName(data.firstName) && Validation.validateLastName(data.lastName) &&  Validation.validateClassification(data.classification)){
        return true
    } else {
        return false
    }
}

//Shows all crimes on the crime index page
router.get("/",   ensureAuthenticated, ensureSecured, function(req, res){
    Crimes.find({}, function(error, crimes){
        if(error){
            console.log(error);
            req.flash("error_msg", "unable to get crimes at this current moment")
            res.redirect("/")
        }else{
            // Add all crimes to array, decrypt them, and then display them
            let crime = [];
            crimes.forEach(cases => {
                crime.push({
                    _id: cases._id,
                    firstName:  Security.decrypt(cases.firstName, algorithm, secretKey),
                    lastName:  Security.decrypt(cases.lastName, algorithm, secretKey),
                    date:  Security.decrypt(cases.date, algorithm, secretKey),
                    time:  Security.decrypt(cases.time, algorithm, secretKey),
                    postcode:  Security.decrypt(cases.postcode, algorithm, secretKey),
                    classification:  cases.classification
                });
            });
            res.render("crime/index", {crimes: crime});
        }});
    });

//new
router.get("/new",  ensureAuthenticated, ensureSecured, function(req, res){
    res.render("crime/new");
});

//create - Create a new crime to be added to the db.
router.post("/",  ensureAuthenticated, ensureSecured, function(req, res){
    if (validate(req.body)){
        Crimes.create({
            firstName:  Security.encrypt(req.body.firstName, algorithm, secretKey),
            lastName:  Security.encrypt(req.body.lastName, algorithm, secretKey),
            date:  Security.encrypt(req.body.date, algorithm, secretKey),
            time:  Security.encrypt(req.body.time, algorithm, secretKey),
            postcode:  Security.encrypt(req.body.postcode, algorithm, secretKey),
            classification:  req.body.classification  
        }, function(error, newCrime){
            if(error){
                console.log(error);
                req.flash("error_msg", "unable to create crimes at this current moment")
                res.redirect("/");
            }else{
                Transaction.create({
                    //create a crime object with values entered by user
                    CarriedOutBy: {
                        id: req.user._id,
                        email: req.user.email},  
                    action: "CREATE",
                    database: "Crimes",
                    reference: newCrime._id,
                });
                req.flash('success_msg', newCrime._id + ' has ben Created');
                res.redirect("/crimes/" + newCrime._id);
            }
        });
    } else {
        req.flash("error_msg", "Incorrect data format inputted")
        res.redirect("/")
    }
});

//Show - Displays information about a crime  
router.get("/:crimeID",  ensureAuthenticated, ensureSecured, function(req, res) {
    Crimes.findById(req.params.crimeID).populate("suspects").exec(function(err, foundCrime){
        if(err){
            console.log(err);
            req.flash("error_msg", "unable to get crime " + req.params.crimeID+ " at the current momemnt")
            res.redirect("/")
        } else {
            let crime = {
                _id: foundCrime._id,
                firstName:  Security.decrypt(foundCrime.firstName, algorithm, secretKey),
                lastName:  Security.decrypt(foundCrime.lastName, algorithm, secretKey),
                date:  Security.decrypt(foundCrime.date, algorithm, secretKey),
                time:  Security.decrypt(foundCrime.time, algorithm, secretKey),
                postcode:  Security.decrypt(foundCrime.postcode, algorithm, secretKey),
                classification: foundCrime.classification,
                edited: foundCrime.edited
            }
            //display all suspects associated with a crime
            let people = []
            foundCrime.suspects.forEach(function(suspect){
                people.push({
                    firstName: Security.decrypt(suspect.firstName, algorithm, secretKey),
                    lastName: Security.decrypt(suspect.lastName, algorithm, secretKey),
                    id: suspect._id
                });
            });
            res.render("crime/show", {crime: crime, suspects: people});
        }
    });
});


//Edit - Allows a user to change the data about a crime
router.get("/:crimeID/edit",  ensureAuthenticated, ensureSecured, function(req, res){
    Crimes.findById(req.params.crimeID, function(error, foundCrime){
        if(error){
            console.log("Failed to load crimes! Please try again later");
            res.redirect("/");
        } else {
            let crime = {
                _id: foundCrime._id,
                firstName:  Security.decrypt(foundCrime.firstName, algorithm, secretKey),
                lastName:  Security.decrypt(foundCrime.lastName, algorithm, secretKey),
                date:  Security.decrypt(foundCrime.date, algorithm, secretKey),
                time:  Security.decrypt(foundCrime.time, algorithm, secretKey),
                postcode:  Security.decrypt(foundCrime.postcode, algorithm, secretKey),
                classification:  foundCrime.classification
            }
            res.render("crime/edit", {crime: crime});
        }
    });
});


//Update - Replace an already existing crime with a new one
router.put("/:crimeID",   ensureAuthenticated, ensureSecured, function(req, res){
    if (validate(req.body)){
        Crimes.findByIdAndUpdate(req.params.crimeID, {
            firstName:  Security.encrypt(req.body.firstName, algorithm, secretKey),
            lastName:  Security.encrypt(req.body.lastName, algorithm, secretKey),
            date:  Security.encrypt(req.body.date, algorithm, secretKey),
            time:  Security.encrypt(req.body.time, algorithm, secretKey),
            postcode:  Security.encrypt(req.body.postcode, algorithm, secretKey),
            classification:  req.body.classification,
            edited: new Date()
        }, function(error, updatedCrime){
            if (error){
                console.log(error);
                req.flash("error_msg", "unable to update crime " + req.params.crimeID+ " at the current momemnt")
                res.redirect("/")
            } else {
                //enter new information to the database
                Transaction.create({
                    CarriedOutBy: {
                        id: req.user._id,
                        email: req.user.email},  
                    action: "UPDATE",
                    database: "Crimes",
                    reference: req.params.crimeID
                });
                req.flash('success_msg', req.params.crimeID + ' has ben updated');
                res.redirect("/crimes");
            }
        });
    } else {
        req.flash("error_msg", "Incorrect data format inputted")
        res.redirect("/")
    }
})


//Destroy - Delete an entry in the database
router.delete("/:crimeID",   ensureAuthenticated, ensureSecured, function(req, res){
    Crimes.findByIdAndRemove(req.params.crimeID, function(error, deleted){
        if (error){
            console.log(error);
            req.flash("error_msg", "unable to delete crime " + req.params.crimeID+ " at the current momemnt")
            res.redirect("/")
        } else {
            Transaction.create({
                CarriedOutBy: {
                    id: req.user._id,
                    email: req.user.email},  
                action: "DESTROY",
                database: "Crimes",
                reference: req.params.crimeID,
            });
            deleted.suspects.forEach(person=>{
                People.findByIdAndRemove(person._id, err=>{
                    if (err) console.log(err);
                })
            });
            req.flash('success_msg', req.params.crimeID + ' has ben deleted');
            res.redirect("/crimes");
        }
    });
});

module.exports = router;