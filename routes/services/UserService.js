const User = require('../../models/UserModel');
const Club = require('../../models/ClubModel');

function AddUserToClub( titleClub, user ){
  Club.findOne({ title : titleClub }, function(err, club){
      if(err) return console.log(err); 
      if(club){
          club.numbers.push(user._id);
          club.save();
          return club._id;
      }
  });
}

function DellUserFromClub( titleClub, user){
  Club.findOne({ title : titleClub }, function(err, club){
      if(err) return console.log(err); 
      if(club){
          club.numbers.splice( club.numbers.indexOf(user._id ), 1 );
          club.save();
          return club._id;
      }
  });
}

class UserService {

	static async getAll() {
		try {
			return await User.find({}).exec();
		} catch (error) {
			throw error;
		}
  }

  static async add(data) {
		try {
      const user = new User({ ...data, ...{ parents: { ...data }} });
      return await user.save()
        .then( (user, err) =>{
          if(err) return console.log(err);
          AddUserToClub( data.club, user);
          return user;
        });
		} catch (error) {
			throw error;
		}
  }

  static async update(id, data) {
		try {
      User.findOne({_id: id}, function(err, user){
        if(err) return console.log(err);
        if( user.club !== data.club ){
          DellUserFromClub( user.club, user );
          AddUserToClub( data.club, user);
        }
      })
      return await User.findOneAndUpdate({_id: id}, { ...data, ...{ parents: { ...data }} }, {new: true})
        .then( (user, err)=>{
          if(err) return console.log(err);
          return user;
        });
		} catch (error) {
			throw error;
		}
  }

  static async remove(id) {
		try {
      return await User.findByIdAndDelete(id)
        .then((user, err)=>{
          if(err) return console.log(err);
          DellUserFromClub( user.club, user );
          return user
        })
      
		} catch (error) {
			throw error;
		}
  }

  static async get(id) {
		try {
      return await User.findOne({_id: id});
		} catch (error) {
			throw error;
		}
  }
  
  static async getByName(name) {
		try {
      return await User.findOne({ name });
		} catch (error) {
			throw error;
		}
  }
}
module.exports.UserService = UserService;