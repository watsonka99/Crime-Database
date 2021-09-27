// created by Kieran Watson

const { stringify } = require("querystring");

const express = require("express"),
      fs = require('fs'),
      People = require("../models/people"),
      router = express.Router(),
      MoPi = require("../MoPi"),
      Security = require("../security");

const { ensureAuthenticated, ensureSecured, ensureIM } = require('../config/authenticated');


const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
function checkbox(input){
    // checks if ticked, if it is returns appropiate boolean
    if (input == "1") {
        return true
     } else {
        return false
     }
}

//show 
 router.get("/", ensureAuthenticated, ensureSecured, ensureIM, function(req, res) {
    let rawdata = fs.readFileSync('./config/mopi.json');
    let mopiConfig = JSON.parse(rawdata);
    res.render('mopi/show', {mopi: mopiConfig});
 });

 //edit 
 router.get("/edit", ensureAuthenticated, ensureSecured, ensureIM, function(req, res) {
    let rawdata = fs.readFileSync('./config/mopi.json');
    let mopiConfig = JSON.parse(rawdata);
    res.render('mopi/edit', {mopi: mopiConfig});
 });

//update
 router.post("/", function(req, res){
     // writes data to mopi.jsom
    let data = JSON.stringify(
      {   
         "Group1": {
             "Review":req.body.Group1Review,
             "Delete":req.body.Group1Delete,
             "Auto": checkbox(req.body.Group1Auto)
         },
         "Group2": {
             "Review":req.body.Group2Review,
             "Delete":req.body.Group2Delete,
             "Auto": checkbox(req.body.Group2Auto)
         },
         "Group3": {
             "Review":req.body.Group3Review,
             "Delete":req.body.Group3Delete,
             "Auto": checkbox(req.body.Group3Auto)
         }
     }, null, 4);
    fs.writeFileSync("./config/mopi.json", data)
    res.redirect("/mopi")
});

//review
router.get("/review", ensureAuthenticated, ensureSecured, ensureIM, function(req, res) {
    let rawdata = fs.readFileSync('./config/mopi.json');
    let mopiConfig = JSON.parse(rawdata);
    People.find({}, function(error, people){
        if(error){
            console.log(error);
        }else{
            let persons = [];
            people.forEach(cases => {
                // checks what classification and if it needs reviewed
                if (cases.classification === "Group 1" && MoPi.reviewFlag(cases.reviewed, MoPi.yearToMiliseconds(mopiConfig.Group1.Review) - 7889400000)){
                    // deletes if auto delete is enabled
                    if (MoPi.reviewFlag(cases.edited, MoPi.yearToMiliseconds(mopiConfig.Group1.Delete)) && mopiConfig.Group1.Delete) {
                        People.findByIdAndDelete(cases._id, err=>{if (err){ console.log(err);}});
                    }else{
                        persons.push({
                            _id: cases._id,
                            firstName:  Security.decrypt(cases.firstName, algorithm, secretKey),
                            lastName:  Security.decrypt(cases.lastName, algorithm, secretKey),
                            classification:  cases.classification
                        });
                    }
                } else if (cases.classification === "Group 2" && MoPi.reviewFlag(cases.reviewed, MoPi.yearToMiliseconds(mopiConfig.Group2.Review) - 7889400000)){
                    if (MoPi.reviewFlag(cases.edited, MoPi.yearToMiliseconds(mopiConfig.Group2.Delete)) && mopiConfig.Group2.Delete) {
                        People.findByIdAndDelete(cases._id, err=>{if (err){ console.log(err);}});
                    }else{
                        persons.push({
                            _id: cases._id,
                            firstName:  Security.decrypt(cases.firstName, algorithm, secretKey),
                            lastName:  Security.decrypt(cases.lastName, algorithm, secretKey),
                            classification:  cases.classification
                        });
                    }
                } else if (cases.classification === "Group 3" && MoPi.reviewFlag(cases.reviewed, MoPi.yearToMiliseconds(mopiConfig.Group3.Review) - 7889400000)){
                    if (MoPi.reviewFlag(cases.edited, MoPi.yearToMiliseconds(mopiConfig.Group3.Delete)) && mopiConfig.Group3.Delete) {
                        People.findByIdAndDelete(cases._id, err=>{if (err){ console.log(err);}});
                    }else{
                        persons.push({
                            _id: cases._id,
                            firstName:  Security.decrypt(cases.firstName, algorithm, secretKey),
                            lastName:  Security.decrypt(cases.lastName, algorithm, secretKey),
                            classification:  cases.classification
                        });
                    }
                }
            });
            res.render('mopi/index', {people: persons});
    }});
});

 module.exports = router;