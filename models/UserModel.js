const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    club: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Clubs'
    },
    titleClub: {
        type: String,
        //required: true
    }
},{versionKey: false});

const User = mongoose.model("User", userScheme);

module.exports = User;