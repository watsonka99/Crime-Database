// Created By Kieran Watson

// Node Dependencies
const express = require('express'),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      session = require('express-session'),
      passport = require('passport'),
      helmet = require('helmet');

const expressLayouts = require('express-ejs-layouts');   

// Passport Config
require('./config/passport')(passport);


// File Dependencies
const indexRoutes = require("./routes/index"),
      crimeRoutes = require("./routes/crimes"),
      peopleRoutes = require("./routes/people"),
      mopiRoutes = require("./routes/mopi"),
      transactionRoutes = require("./routes/transaction"),
      reviewRoutes = require("./routes/review");

// MongoDB Configuration
const db = require('./config/keys').MongoURI;



// Local MongoDB
mongoose.connect("mongodb://localhost:27017/auth", {
     useNewUrlParser: true,
     useUnifiedTopology: true, 
     useFindAndModify: false 
 })
 .then(() => console.log('Connected to DB!'))
 .catch(error => console.log(error.message));      

 
// Node server 
const app = express();
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// helmet (Protects from http )
app.use(helmet())

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use(indexRoutes);
app.use('/users', require('./routes/users'));
app.use('/crimes', crimeRoutes);
app.use(peopleRoutes)
app.use('/mopi', mopiRoutes);
app.use('/transaction', transactionRoutes);
app.use(reviewRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
