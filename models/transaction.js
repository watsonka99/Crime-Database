// Created by Kieran Watson

const mongoose = require('mongoose');

const TransactionSehma = new mongoose.Schema({
    CarriedOutBy: { 
        id: {// these ones
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    email: String
    },
    action: {//
        type: String
    },
    database: {//
        type: String
    },
    reference: {//
        type: String
    },
    old: {
        type: String,
    },
    changes: {
        type: String
    },
    date: {//
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', TransactionSehma);

module.exports = Transaction;