const Club = require('../../models/ClubModel');

class ClubService {
	static async getAll() {
		try {
			return await Club.find({}).exec();
		} catch (error) {
			throw error;
		}
  }

  static async update(id, data) {
		try {
      return await Club.findOneAndUpdate({_id: id}, data, {new: true})
        .then( function(club, err) {
          if(err) return console.log(err);
          return club;
        });
		} catch (error) {
			throw error;
		}
  }

  static async addInfo(id, data, key) {
		try {
      return await Club.findById(id)
        .then( async (club, err)=>{
          if(err) return console.log(err);
          if(data && key in club) {
            club[key] = [ ...club[key], data];
            return await club.save()
              .then( (club) =>{ 
                return club;
              })
          }
        }) 
		} catch (error) {
			throw error;
		}
  }
  
}
module.exports.ClubService = ClubService;