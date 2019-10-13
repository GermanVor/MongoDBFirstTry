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
        ref: 'Club'
    },
},{versionKey: false});

const clubScheme = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    numbers: [
        {   
            serialNumber: { "type": Number, "default": 1 },
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Member'
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
    Club.findOne({title : 'Corgi Abbey' }, function(err, club){
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
         
    const id = req.params.id;
    User.findOne({_id: id}, function(err, user){
          
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.post("/api/users", jsonParser, function(req, res) {
 
    if(!req.body) return res.sendStatus(400);
        
    const userName = req.body.name;
    const userAge = req.body.age;
    //const club = req.body.club;
    const user = new User({name: userName, age: userAge, club: PugAbbey._id}); // club 
    
    user.save(function(err){
        if(err) return console.log(err);

        Club.findOneAndUpdate(
            { title: 'PugAbbey' }, //club
            function(err, club) {
                if (err) throw err;
                club.numbers.push(use._id);
                // club.save(done);
        });
        

        res.send(user);
    });
});
     
app.delete("/api/users/:id", function(req, res){
         
    const id = req.params.id;
    User.findByIdAndDelete(id, function(err, user){
                
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.put("/api/users", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newUser = {age: userAge, name: userName};
    
    User.findOneAndUpdate({_id: id}, newUser, {new: true}, function(err, user){
        if(err) return console.log(err); 
        res.send(user);
    });
});