// created by Ryan Donnelly

const mongoose = require("mongoose");

//a mongoose db schema for crimes
const CrimeSchema = new mongoose.Schema({
    firstName: {content:String,
        iv: String},
    lastName: {content:String,
        iv: String},
    date: {content:String,
        iv: String},
    time: {content:String,
        iv: String},
    postcode: {content:String,
        iv: String},
    suspects:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "People"}],
    classification: String,
    created: {type: Date, default: Date.now},
    edited: {type: Date, default: Date.now}
});


module.exports = mongoose.model("Crime", CrimeSchema);