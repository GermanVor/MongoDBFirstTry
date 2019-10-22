const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubScheme = new Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    title: String,
    numbers: [
        {   
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
},{versionKey: false});

const Club = mongoose.model('Clubs', clubScheme);

module.exports = Club;