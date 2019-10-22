const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const AdminScheme = new Schema({
    salt : String,
    name: String,
    password : String
},{versionKey: false});

AdminScheme.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
AdminScheme.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

module.exports = mongoose.model('Admin', AdminScheme);