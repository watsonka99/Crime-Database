// Created by Kieran Watson

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    harm: String,  
    children:String,
    trust:String,
    associations: String,
    substance: String,
    mentalState: String,
    impact: String,
    interest: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);