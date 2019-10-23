const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubScheme = new Schema({
    title: String,
    info: String,
    medals: [
        {
            type: String
        }
    ],
    experts: [
        { type: String}
    ],
    numbers: [
        {   
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
},{versionKey: false});

const Club = mongoose.model('Clubs', clubScheme);

module.exports = Club;