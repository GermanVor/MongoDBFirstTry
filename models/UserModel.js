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
    parents: {
        mom: {
            type: String,
            required: true
        },
        dad: {
            type: String,
            required: true
        }
    },
    info: {
        type: String,
        required: true
    },
    club: {
        type: String,
        //required: true
    }
},{versionKey: false});

const User = mongoose.model("User", userScheme);

module.exports = User;
// club: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Clubs'
// },