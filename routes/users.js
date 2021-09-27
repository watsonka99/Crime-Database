// created by Rikardas Bleda

const express = require("express"),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      passport = require('passport'),
      mongoose = require('mongoose'),
      generator = require('generate-password'),
      nodemailer = require('nodemailer'),
      async = require('async'),
      crypto = require('crypto');

const { ensureAuthenticated } = require('../config/authenticated');
const { ensureAdmin } = require('../config/authenticated');
const { ensureSecured } = require('../config/authenticated');

// User Model
const User = require('../models/User');

// Login Page
router.get("/login", (req, res) => res.render('login'));

// Register Page
router.get("/register", ensureAuthenticated, ensureAdmin, ensureSecured, (req, res) => res.render('register'));

// Register Page if need to bypass authentication (UNCOMMENT)
//router.get("/register", (req, res) => res.render('register'));

// Account Recovery Page
router.get('/forgot', (req, res) => 
    res.render('forgot', {
        user: req.user
}));

// Home information page for logged in users
router.get("/home",ensureAuthenticated, ensureSecured, (req, res) => res.render('home'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, role } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !role) {
        errors.push({ msg: 'All fields are required!' });
    }

    // Re-render if errors occured
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // If email already exists
                errors.push({ msg: 'Email is already in use'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    role
                });
            } else {
                // Generate a temporary password
                var password = generator.generate({
                    length: 12,
                    numbers: true
                });

                // Create the user based on inputs
                const newUser = new User({
                    name,
                    email,
                    password,
                    role
                });

                //Send an email to the user with account details

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'mopitesting@gmail.com',
                      pass: 'UvkR7D4M!5'
                    }
                });

                var mailOptions = {
                    from: 'mopitesting@gmail.com',
                    to: email,
                    subject: 'Account succesfully created',
                    text: "You have been granted access to the MOPI System." 
                        + "\n" + "Your temporary password is: " + password + "\n" + 
                        "Login and change your password at http://localhost:3000/"
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });  

                // Salt + Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Save the hashed user password
                        newUser.password = hash;
                        // Save the user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Registration complete');
                                res.redirect('/admin');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }
});

// Login Handle
router.post('/login', emailToLowerCase, passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: true
    }), (req, res, next) => {
        // Continue user is not using a temporary password
        if(req.user.confirmed === true) {
            res.redirect('/dashboard');
        }
        // Otherwise force a password change
        if(req.user.confirmed === false) {
            res.redirect('/passwordChange');
        }
});
function emailToLowerCase(req, res, next){
    req.body.email = req.body.email.toLowerCase();
    next();
}

// Update Account
router.get("/:userId/edit", ensureAuthenticated, ensureSecured, function(req, res){
    User.findById(req.params.userId, (err, foundUser) =>
    res.render('update', {
        user: foundUser,
        role: req.user.role
        }))
});

// Account Handle
router.post('/dashboard', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Admin Handle
router.post('/dashboard', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// User Details Handle
router.post('/admin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/details',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Update Handle
router.post("/:userId/edit", function(req, res){
    const userId = req.params.userId;
    // Find user by ID
    User.findById(userId, function (err, user) {
        // If no match exists, redirect
        if (!user) {
            req.flash('error', 'No account found');
            console.log(err);
            return res.redirect('/users/login');
        }
        
        // Inputs from user submitted form
        var name = req.body.name.trim();
        var email = req.body.email.trim();
        var password = req.body.password.trim();
        var password2 = req.body.password2.trim();
        var role = req.body.role;

        let errors = [];

        // Check required fields
        if(!name || !email || !password || !password2) {
            errors.push({ msg: 'All fields are required!' });
        }

        // Check if passwords match
        if(password !== password2) {
            errors.push({ msg: 'Passwords do not match!' });
        }

        // Check password length
        if(password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters'});
        }

        // Re-render if any errors exist
        if(errors.length > 0) {
            res.render('update', {
                user: user,
                errors, 
                name,
                email,
                role: req.user.role
            });
        } else {
            User.findOne({ _id: userId})
            .then(user =>{
                if(!user) {
                    // If user is not found
                    errors.push({ msg: 'User is not logged in.'});
                    res.redirect('/users/login');
                } else {
                    User.countDocuments({email: email}, (err, c) => {
                        // Check if the wanted email is in use but ignore the currently used email 
                        // But also let admin bypass this to change any users data
                        if(c == 0 || email == req.user.email || req.user.role == "admin") {
                            // If passed, update user details
                            user.name = name;
                            user.email = email;
                            user.password = password;
                            user.role = role;
                            
                            // Salt + Hash password
                            bcrypt.genSalt(10, (err, salt) => 
                                bcrypt.hash(user.password, salt, (err, hash) => {
                                    if(err) throw err;
                                    // Save the hashed user password
                                    user.password = hash;
                                    // Save the user
                                    user.save()
                                        .then(user => {
                                            req.flash('success_msg', 'Accound successfully updated');
                                            res.redirect('/dashboard');
                                        })
                                        .catch(err => console.log(err));
                            }))

                        } else {
                            // If email is already in use
                            errors.push({ msg: 'Email is already in use'});
                            res.render('update', {
                                user: user,
                                errors,
                                name,
                                email,
                                password,
                                password2,
                                role
                            });
                        }
                    })
                }
            });
        }
    });
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully logged out');
    res.redirect('/users/login');
});


// Temporary Password Change Handle
router.post('/passwordChange', (req, res) => {
    // Inputs from user submitted form
    const { password, password2 } = req.body;

    let errors = [];
    
    // Check required fields
    if(!password || !password2) {
        errors.push({ msg: 'All fields are required!' });
    }

    // Check if passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match!' });
    }

    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters'});
    }

    // Re-render if any errors exist
    if(errors.length > 0) {
        res.render('passwordChange', {
            errors
        });
    } else {
        User.findOne({ _id: req.user._id})
        .then(user =>{
            if(!user) {
                // If user is not found
                errors.push({ msg: 'User is not logged in.'});
                res.redirect('/users/login');
            } else {
                // Update user password
                user.password = password;

                // Salt + Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(user.password, salt, (err, hash) => { 
                        if(err) throw err;
                        // Save the hashed user password
                        user.password = hash;
                        user.confirmed = true;
                        // Save the user
                        user.save()
                        .then(user => {
                             req.flash('success_msg', 'Accound successfully updated');
                             res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        }))
            }
        });
    }
});

// Account Recovery Handle
router.post('/forgot', function(req, res, next) {
    // Check if email is attached to any account
    User.findOne({ email: req.body.email }, function(err, user) {
        // Redirect if no match is found
        if (!user) {
            req.flash('error', 'Email is not registered within our system.');
            return res.redirect('/forgot');
        }
        
        // Generate recovery token
        crypto.randomBytes(20, function(err, buffer) {
            const token = buffer.toString('hex');

            // Set the unique token to user and give it an expiration time of 30 minutes
            user.recoveryPasswordToken = token;
            user.recoveryPasswordExpires = Date.now() + 1800000;

            // Save the user
            user.save()
            .then(user => {
                req.flash('success_msg', 'Recovery link has been sent to the provided email!');
            })
            .catch(err => console.log(err));

            // Send the user the unique recovery link through email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'mopitesting@gmail.com',
                pass: 'UvkR7D4M!5'
            }});

            var mailOptions = {
                from: 'mopitesting@gmail.com',
                to: user.email,
                subject: 'Account Recovery Request',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:3000/users/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.redirect('/users/register')
                } else {
                    console.log('Email sent: ' + info.response);
                    res.redirect('/users/login')
                }
            });

        });
    });
});

// Account Reset Page
router.get('/reset/:token', function(req, res) {
    // Find an account with a matching valid reset token
    User.findOne({ recoveryPasswordToken: req.params.token, recoveryPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      // Redirect if no match is found or the token has expired
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        console.log("token broken :( ");
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user,
        token: req.params.token
      });
    });
  });

// Account Reset Handle
router.post('/reset/:token', function(req, res) {
    const token = req.params.token;
    // Find an account with a matching valid reset token
    User.findOne({ recoveryPasswordToken: token, recoveryPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        // Redirect if no match is found or the token has expired
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
        }

        // Inputs from user submitted form
        var password = req.body.password.trim();
        var password2 = req.body.password2.trim();

        let errors = [];

        // Check required fields
        if(!password || !password2) {
            errors.push({ msg: 'All fields are required!' });
        }

        // Check if passwords match
        if(password !== password2) {
            errors.push({ msg: 'Passwords do not match!' });
        }

        // Check password length
        if(password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters'});
        }

        // Re-render if any errors exist
        if(errors.length > 0) {
            res.render('reset', {
                token: req.params.token,
                errors
            });
        } else {
            
            // Remove token and its expiration date from user
            user.recoveryPasswordToken = undefined;
            user.recoveryPasswordExpires = undefined; 

            // Salt + Hash password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    // Save the hashed user password
                    user.password = hash;
                    // Save the user
                    user.save(function(err) {
                        req.flash('success', 'Account has been successfully updated!');
                    });
                }))

            // Send the user a notification email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'mopitesting@gmail.com',
                pass: 'UvkR7D4M!5'
            }});

            var mailOptions = {
                from: 'mopitesting@gmail.com',
                to: user.email,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' + 'This is a confirmation that the password for your account ' + 
                    user.email + ' has just been changed.\n'
                };
        
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.redirect('/users/login');
                } else {
                    req.flash('success', 'Your password has been successfully changed!');
                    console.log('Email sent: ' + info.response);
                    res.redirect('/users/login');
                }
            });
        }
      });
});  

module.exports = router;