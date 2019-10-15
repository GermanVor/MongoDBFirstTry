const mongoose = require("mongoose");

const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
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

const clubScheme = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    numbers: [
        {   
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
},{versionKey: false});

const User = mongoose.model("User", userScheme);
const Club = mongoose.model('Clubs', clubScheme);

app.use(express.static(__dirname + "/public"));

let PugAbbey = new Club({
    _id: new mongoose.Types.ObjectId(),
    title: 'Pug Abbey',
    numbers: []
});

let CorgiAbbey = new Club({
    _id: new mongoose.Types.ObjectId(),
    title: 'Corgi Abbey',
    numbers: []
});

mongoose.connect("mongodb://localhost:27017/dogExhibitiondb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);

    Club.findOne({title : 'Pug Abbey' }, function(err, club){
        if(err) return console.log(err); 
        if(! club) PugAbbey.save();
        else {
            PugAbbey =  club;
        }
    });
    Club.findOne({title: 'Corgi Abbey' }, function(err, club){
        if(err) return console.log(err); 
      
        if(! club) CorgiAbbey.save();
        else CorgiAbbey =  club;
    });

    app.listen(3001, function(){
        console.log("Сервер ожидает подключения...http://localhost:3001");
    });
    
});

app.get("/api/users", function(req, res){

    User.find({}, function(err, users){
 
        if(err) return console.log(err);
        res.send(users)
    });
});
 
app.get("/api/users/:id", function(req, res){
    User.findOne({_id: req.params.id}, function(err, user){
        if(err) return console.log(err);

        res.send(user);
    });
});
    
app.post("/api/users", jsonParser, function(req, res) {
 
    if(!req.body) return res.sendStatus(400);
  
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        titleClub: req.body.club 
    });
    
    user.save(function(err){
        if(err) return console.log(err);
  
        Club.findOne({ title : req.body.club }, function(err, club){
            if(err) return console.log(err); 

            if(club){
                club.numbers.push(user._id);
                user.club = club._id;
                user.save();
                club.save();
            }
        });
        
        res.send(user);
    });
});
     
app.delete("/api/users/:id", function(req, res){
    User.findByIdAndDelete(req.params.id, function(err, user){
        if(err) return console.log(err);
     
        Club.findById(user.club, function(err, club){ 
            if(err) return console.log(err); 

            if(club){
                club.numbers.splice( club.numbers.indexOf(user._id ), 1 );
                club.save()
            }
        });

        res.send(user);
    });
});
    
app.put("/api/users", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const newUser = {age: req.body.age, name: req.body.name};
    
    User.findOneAndUpdate({_id: req.body.id}, newUser, {new: true}, function(err, user){
        if(err) return console.log(err); 
        res.send(user);
    });
});