// created by Kieran Watson

const express = require("express"),
      router  = express.Router(),
      Transaction = require("../models/transaction");

const { ensureAuthenticated, ensureSecured, ensureIM } = require('../config/authenticated');

// INDEX
router.get("/",  ensureAuthenticated, ensureSecured, ensureIM, function(req, res){
    Transaction.find({}, function(err, transactions){
        if (err) {
            console.log(err);
            req.flash("error_msg", "Failed to load transactions")
            res.redirect("/"); 
        } else {
            res.render("transaction/index", {transactions: transactions});  
        }
    });
});

module.exports = router;