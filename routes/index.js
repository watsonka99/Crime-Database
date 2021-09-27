// created by Rikardas Bleda & Kieran Watson

const express = require("express"),
      router = express.Router();

const { ensureAuthenticated } = require('../config/authenticated');
const { ensureAdmin } = require('../config/authenticated');
const { ensureSecured } = require('../config/authenticated');
const User = require('../models/User');

// Welcome Page
router.get("/", (req, res) => res.render('welcome'));

// Dashboard
router.get("/dashboard", ensureAuthenticated, ensureSecured, (req, res) => 
    res.render('dashboard', {
        name: req.user.name,
        role: req.user.role
    }));

// Account
router.get("/account", ensureAuthenticated, ensureSecured, (req, res) => 
    res.render('account', {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id
    }));

// Admin Tools
router.get("/admin", ensureAuthenticated, ensureAdmin, ensureSecured, (req, res) => 
    res.render('admin', {
        name: req.user.name,
        role: req.user.role
    }));

// User Details
router.get("/details", ensureAdmin, ensureAuthenticated, ensureSecured, (req, res) => 
    User.find({}).exec((err, users) =>
        res.render('details', {
            "users": users,
            _id: req.user._id
    })));


// Temporary Password Change
router.get("/passwordChange", ensureAuthenticated, (req, res) => res.render('passwordChange'));

module.exports = router;
