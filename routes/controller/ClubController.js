const { ClubService } = require('../services/ClubService');
const Util = require('../utils/Utils');

const util = new Util();

class ClubController {
  static async getAll(req, res) {
		try {
      const Clubs = await ClubService.getAll();
			if (Clubs.length > 0)
				util.setSuccess(200, 'Clubs Received', Clubs);
      else util.setSuccess(200, 'No Clubs found');
      
			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
  }

  static async update(req, res) {
		let {id} = req.params;
		if ( !req.body || !id) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
		let Info = {
			experts: req.body.experts.filter( a => a!==''),
			medals: req.body.medals.filter( a => a!=='')
		};

		try {
			const Club = await ClubService.update(id, Info);
     
			if (!Club)
				util.setError(404, `Club with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Club updated',  Club);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
  }
  
  static async addInfo(req, res) {
		let {id} = req.params;
		if ( !req.body || !id || !req.body.key) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
		
		try {
			const Club = await ClubService.addInfo(id, req.body.data, req.body.key);
			console.log( Club )
			if (!Club)
				util.setError(404, `Club with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Club updated',  Club);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
  }
}	

module.exports.ClubController = ClubController;
  
