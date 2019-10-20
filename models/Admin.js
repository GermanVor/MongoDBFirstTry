const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminScheme = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    AdminName: String,
    Password : String
},{versionKey: false});

const Admin = mongoose.model('Admins', AdminScheme);

module.exports = Admin;