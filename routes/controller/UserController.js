const { UserService } = require('../services/UserService');
const Util = require('../utils/Utils');

const util = new Util();

class UserController {
  static async getAll(req, res) {
		try {
      const Users = await UserService.getAll();
			if (Users.length > 0)
				util.setSuccess(200, 'Users Received', Users);
      else util.setSuccess(200, 'No Users found');
      
			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
  }

  static async add(req, res) {
    let data = req.body;
		if (!data.name || !data.mom || !data.dad || !data.info || !data.age) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
		try {
      const user = await UserService.add(data);
      
			util.setSuccess(201, 'User Added', user);
			return util.send(res);
		} catch (error) {
			util.setError(400, error.message);
			return util.send(res);
		}
  }
  
  static async update(req, res) {
		if ( !req.body.id  ) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
		try {
			const User = await UserService.update(req.body.id, req.body);
      // console.log( User )
			if (!User)
				util.setError(404, `User with the id ${req.body.id} cannot be found`);
			else util.setSuccess(200, 'User updated',  User);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
  }
  
  static async remove(req, res) {
		const {id} = req.params;
		if (!id ) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const User = await UserService.remove(id);

			if (User)
				util.setSuccess(200, 'User deleted');
			else util.setError(404, `User with the id ${id} cannot be found`);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

  static async get(req, res) {
		const {id} = req.params;
		
		if (!id) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const User = await UserService.get(id);

			if (!User)
				util.setError(404, `User with the id ${id} cannot be found`);
			else util.setSuccess(200, 'User Found', User);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
  }
  
  static async getByName(req, res) {
		const {name} = req.params.name;
		
		if (!name) {
			util.setError(400, 'Invalid Name');
			return util.send(res);
		}

		try {
			const User = await UserService.getByName(name);

			if (!User)
				util.setError(404, `User with the Name ${name} cannot be found`);
			else util.setSuccess(200, 'User Found', User);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
  }

}	

module.exports.UserController = UserController;
  
