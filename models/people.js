// created by Daniel Seawards

const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema({
    firstName: {
        content: {type: String, default: "FNU"},
        iv: String},
    lastName: {
        content:{type: String, default: "SNU"},
        iv: String},
    age: {content:String,
        iv: String},
    build: {content:String,
        iv: String},
    clothes: {content:String,
        iv: String},
    distinguishingFeatures: {content:String,
        iv: String},
    elevation: {content:String,
        iv: String},
    face: {content:String,
        iv: String},
    hair: {content:String,
        iv: String},
    gait: {content:String,
        iv: String},
    sex: {content:String,
        iv: String},
    classification: String,
    associatedCrimes: [{type: mongoose.Schema.Types.ObjectId,
        ref: "crimes"}],
    reviews: [{type: mongoose.Schema.Types.ObjectId,
        ref: "Review"}],
    created: {type: Date, default: Date.now},
    reviewed: {type: Date, default: Date.now},
    edited: {type: Date, default: Date.now}
});

const People = mongoose.model('People', PeopleSchema);
module.exports = People;
