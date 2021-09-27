// created by Rikardas Bleda

const LocalStrategy = require('passport-local').Strategy,
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

// Passport-based account validation
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'This email is not registered'});
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (err, match) => {
                        if(err) throw err;
                        if(match) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect password'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // Create user session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    // Close user session
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}