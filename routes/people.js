// Created By Daniel Sewards


const { route } = require(".");
const express = require("express"),
router  = express.Router(),
transaction = require("../models/transaction"),
Security = require("../security"),
Crime = require("../models/crimes"),
People = require("../models/people"),
Review = require("../models/review"),
Validate = require("../validation");
const Sequelize = require('sequelize'); 
const people = require("../models/people");
const Op = Sequelize.Op;

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';   

const { ensureAuthenticated, ensureSecured } = require('../config/authenticated');

function validate(data) {
    if (Validation.validateFirstName(data.firstName) && Validation.validateLastName(data.lastName) &&  Validation.validateClassification(data.classification)){
        return true
    } else {
        return false
    }
}

//index
router.get("/people", ensureAuthenticated, ensureSecured, function(req, res){
    // gets all people
    People.find({}, function(error, people){
        if (error) {
            // error handling
            console.log(error);
            req.flash("error_msg", "unable to load people at this moment")
            res.redirect("/"); 
        } else {
            let person = [];
            people.forEach(function(foundPeople) {
                person.push({
                    // decrypts data and adds to array
                    _id: foundPeople._id,
                    firstName: Security.decrypt(foundPeople.firstName, algorithm, secretKey),
                    lastName: Security.decrypt(foundPeople.lastName, algorithm, secretKey),
                    age: Security.decrypt(foundPeople.age, algorithm, secretKey),
                    build: Security.decrypt(foundPeople.build, algorithm, secretKey),
                    clothes: Security.decrypt(foundPeople.clothes, algorithm, secretKey),
                    distinguishingFeatures: Security.decrypt(foundPeople.distinguishingFeatures , algorithm, secretKey),
                    elevation: Security.decrypt(foundPeople.elevation, algorithm, secretKey),
                    face: Security.decrypt(foundPeople.face, algorithm, secretKey),
                    hair: Security.decrypt(foundPeople.hair, algorithm, secretKey),
                    gait: Security.decrypt(foundPeople.gait, algorithm, secretKey),
                    sex: Security.decrypt(foundPeople.sex, algorithm, secretKey),
                    classification: foundPeople.classification
                });
            });   
            // loads webpage with said array
            res.render('Peoples/index', { people: person });
            
        }
    });
});


// NEW
router.get("/crimes/:crimeID/people/new", ensureAuthenticated, ensureSecured,  function(req, res){
    //loads webpage
    res.render("Peoples/new", {crimeID: req.params.crimeID});
});

// CREATE
router.post("/crimes/:crimeID/people", ensureAuthenticated, ensureSecured,  function(req, res){
    // validates data
    if (validate(req.body)){
        Crime.findById(req.params.crimeID, function(error, foundCrime){
            if (error) {
                console.log(error);
                req.flash("error_msg", "unable to create Person at this moment")
                res.redirect("/"); 
            } else {
                // encryptes and adds data to db
                People.create({
                    firstName: Security.encrypt(req.body.firstName, algorithm, secretKey),
                    lastName: Security.encrypt(req.body.lastName, algorithm, secretKey),
                    age: Security.encrypt(req.body.age, algorithm, secretKey),
                    build: Security.encrypt(req.body.build, algorithm, secretKey),
                    clothes: Security.encrypt(req.body.clothes, algorithm, secretKey),
                    distinguishingFeatures: Security.encrypt(req.body.distinguishingFeatures, algorithm, secretKey),
                    elevation: Security.encrypt(req.body.elevation, algorithm, secretKey),
                    face: Security.encrypt(req.body.face, algorithm, secretKey),
                    hair: Security.encrypt(req.body.hair, algorithm, secretKey),
                    gait: Security.encrypt(req.body.gait, algorithm, secretKey),
                    sex: Security.encrypt(req.body.sex, algorithm, secretKey),
                    classification: req.body.classification
                }, function(err, newPerson){
                    if(err){
                        console.log(err);
                        req.flash("error_msg", "unable to create person at this moment")
                        res.redirect("/"); 
                    } else {
                        newPerson.associatedCrimes = foundCrime;
                        newPerson.save();
                        foundCrime.suspects.push(newPerson);
                        foundCrime.save();
                        //creates a transaction which will appear on the transaction index page
                        transaction.create({
                            CarriedOutBy: {
                                id: req.user._id,
                                email: req.user.email},  
                            action: "CREATE",
                            database: "People",
                            reference: newPerson._id
                        });
                        req.flash('success_msg', req.body.firstName+ ' '+ req.body.lastName + ' has ben created');
                        res.redirect("/crimes/"+req.params.crimeID);
                    }
                });
            }
        });
    } else {
        req.flash("error_msg", "Incorrect data format inputted")
        res.redirect("/")
    }
});

// show
router.get("/people/:PeopleID", ensureAuthenticated, ensureSecured,  function(req, res) {
    People.findById(req.params.PeopleID).populate("crimes","Review").exec(function(error, foundPeople){
        if(error){
            console.log(error);
            req.flash("error_msg", "unable to load person at this moment");
            res.redirect("/people");
        } else {
            let person = {
                _id: foundPeople._id,
                firstName: Security.decrypt(foundPeople.firstName, algorithm, secretKey),
                lastName: Security.decrypt(foundPeople.lastName, algorithm, secretKey),
                age: Security.decrypt(foundPeople.age, algorithm, secretKey),
                build: Security.decrypt(foundPeople.build, algorithm, secretKey),
                clothes: Security.decrypt(foundPeople.clothes, algorithm, secretKey),
                distinguishingFeatures: Security.decrypt(foundPeople.distinguishingFeatures , algorithm, secretKey),
                elevation: Security.decrypt(foundPeople.elevation, algorithm, secretKey),
                face: Security.decrypt(foundPeople.face, algorithm, secretKey),
                hair: Security.decrypt(foundPeople.hair, algorithm, secretKey),
                gait: Security.decrypt(foundPeople.gait, algorithm, secretKey),
                sex: Security.decrypt(foundPeople.sex, algorithm, secretKey),
                classification: foundPeople.classification,
                reviews: foundPeople.reviews
            }
            //adds the id of the suspects associated crime and passes it to the webpage
            let crime1 = []
            foundPeople.associatedCrimes.forEach(function(crime){
                crime1.push({
                    id: crime._id
                });
            });
            res.render("Peoples/show", {people: person, crimes: crime1});
        }
    });
});

// edit
router.get("/people/:PeopleID/edit", ensureAuthenticated, ensureSecured,  function(req, res){
    People.findById(req.params.PeopleID, function(error, foundPeople){
        if(error){
            console.log(error)
            req.flash("error_msg", "unable to load person at this moment")
            res.redirect("/people");
        } else {
            let person = {
                _id: foundPeople._id,
                firstName: Security.decrypt(foundPeople.firstName, algorithm, secretKey),
                lastName: Security.decrypt(foundPeople.lastName, algorithm, secretKey),
                age: Security.decrypt(foundPeople.age, algorithm, secretKey),
                build: Security.decrypt(foundPeople.build, algorithm, secretKey),
                clothes: Security.decrypt(foundPeople.clothes, algorithm, secretKey),
                distinguishingFeatures: Security.decrypt(foundPeople.distinguishingFeatures , algorithm, secretKey),
                elevation: Security.decrypt(foundPeople.elevation, algorithm, secretKey),
                face: Security.decrypt(foundPeople.face, algorithm, secretKey),
                hair: Security.decrypt(foundPeople.hair, algorithm, secretKey),
                gait: Security.decrypt(foundPeople.gait, algorithm, secretKey),
                sex: Security.decrypt(foundPeople.sex, algorithm, secretKey),
                classification: foundPeople.classification
            }
            res.render("Peoples/edit", {people: person, crimeID: req.params.crimeID});
        }
    });
});
  
// update
router.put("/people/:PeopleID", ensureAuthenticated, ensureSecured, function(req, res){
    if (validate(req.body)){
        People.findByIdAndUpdate(req.params.PeopleID, {
            firstName: Security.encrypt(req.body.firstName, algorithm, secretKey),
            lastName: Security.encrypt(req.body.lastName, algorithm, secretKey),
            age: Security.encrypt(req.body.age, algorithm, secretKey),
            build: Security.encrypt(req.body.build, algorithm, secretKey),
            clothes: Security.encrypt(req.body.clothes, algorithm, secretKey),
            distinguishingFeatures: Security.encrypt(req.body.distinguishingFeatures , algorithm, secretKey),
            elevation: Security.encrypt(req.body.elevation, algorithm, secretKey),
            face: Security.encrypt(req.body.face, algorithm, secretKey),
            hair: Security.encrypt(req.body.hair, algorithm, secretKey),
            gait: Security.encrypt(req.body.gait, algorithm, secretKey),
            sex: Security.encrypt(req.body.sex, algorithm, secretKey),
            classification: req.body.classification,
            edited: new Date(),
            reviewed: new Date()
        }, function(error, updatedPeople){
            if (error){
                console.log(error)
                req.flash("error_msg", "unable to update person at this moment")
                res.redirect("/");
                res.redirect("/people/"+req.params.PeopleID);
            } else {
                transaction.create({
                    CarriedOutBy: {
                        id: req.user._id,
                        email: req.user.email},  
                    action: "UPDATE",
                    database: "People",
                    reference: req.params.PeopleID
                });
                req.flash('success_msg', req.body.firstName+ ' '+ req.body.lastName + ' has been updated');
                res.redirect("/people/"+req.params.PeopleID);
            }
        });
    } else {
        req.flash("error_msg", "Incorrect data format inputted")
        res.redirect("/")
        res.redirect("/people/"+req.params.PeopleID)
    }
});
  
// Destroy
router.delete("/people/:PeopleID", ensureAuthenticated, ensureSecured,  function(req, res){
    People.findByIdAndRemove(req.params.PeopleID, function(error, deletedPerson){
        if (error){
            console.log(error)
            req.flash("error_msg", "unable to update person at this moment")
            res.redirect("/");
        } else {
            transaction.create({
                CarriedOutBy: {
                    id: req.user._id,
                    email: req.user.email},  
                action: "UPDATE",
                database: "People",
                reference: req.params.PeopleID
            });
            req.flash('success_msg', req.params.PeopleID + ' has ben deleted');
            res.redirect("/people");
        }
    });
});

// show
router.get("/people/:PeopleID",ensureAuthenticated, ensureSecured,  function(req, res) {
    People.findById(req.params.PeopleID).populate("crimes","Review").exec(function(error, foundPeople){
        if(error){
            console.log("Failed to show people");
            res.redirect(back);
        } else {
            let person = {
                _id: foundPeople._id,
                firstName: Security.decrypt(foundPeople.firstName, algorithm, secretKey),
                lastName: Security.decrypt(foundPeople.lastName, algorithm, secretKey),
                age: Security.decrypt(foundPeople.age, algorithm, secretKey),
                build: Security.decrypt(foundPeople.build, algorithm, secretKey),
                clothes: Security.decrypt(foundPeople.clothes, algorithm, secretKey),
                distinguishingFeatures: Security.decrypt(foundPeople.distinguishingFeatures , algorithm, secretKey),
                elevation: Security.decrypt(foundPeople.elevation, algorithm, secretKey),
                face: Security.decrypt(foundPeople.face, algorithm, secretKey),
                hair: Security.decrypt(foundPeople.hair, algorithm, secretKey),
                gait: Security.decrypt(foundPeople.gait, algorithm, secretKey),
                sex: Security.decrypt(foundPeople.sex, algorithm, secretKey),
                classification: foundPeople.classification,
                reviews: foundPeople.reviews
            }
            res.render("Peoples/show", {people: person, crimeID: req.params.crimeID});
        }
    });
});

// Search Handle
router.post('/people', (req, res, next) => {
    People.find({}, function(error, people){
        if (error) {
            console.log(error);
            req.flash("error_msg", "unable to load people at this moment")
            res.redirect("/"); 
        } else {
            let person = [];
            people.forEach(function(foundPeople) {
                person.push({
                    _id: foundPeople._id,
                    firstName: Security.decrypt(foundPeople.firstName, algorithm, secretKey),
                    lastName: Security.decrypt(foundPeople.lastName, algorithm, secretKey),
                    age: Security.decrypt(foundPeople.age, algorithm, secretKey),
                    build: Security.decrypt(foundPeople.build, algorithm, secretKey),
                    clothes: Security.decrypt(foundPeople.clothes, algorithm, secretKey),
                    distinguishingFeatures: Security.decrypt(foundPeople.distinguishingFeatures , algorithm, secretKey),
                    elevation: Security.decrypt(foundPeople.elevation, algorithm, secretKey),
                    face: Security.decrypt(foundPeople.face, algorithm, secretKey),
                    hair: Security.decrypt(foundPeople.hair, algorithm, secretKey),
                    gait: Security.decrypt(foundPeople.gait, algorithm, secretKey),
                    sex: Security.decrypt(foundPeople.sex, algorithm, secretKey),
                    classification: foundPeople.classification
                });
            });   
            
            var firstName = req.body.name.trim();
            var lastName = req.body.name2.trim();
        
            const foundPeople = person.filter(currentPerson => 
                currentPerson.firstName == firstName && currentPerson.lastName == lastName);
            
            res.render('Peoples/index', {
                searchResult: foundPeople,
                people: person
            });
        }
    });

});

module.exports = router;
