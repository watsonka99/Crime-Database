// Created by Rikardas Bleda

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    recoveryPasswordToken: {
        type: String,
        required: false
    },
    recoveryPasswordExpires: {
        type: Date,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;