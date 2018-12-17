const userDataBase = require('../dataBase/userDatabase');

class UserService {
  async getUser(id) {
    return await userDataBase.getUser(id);
  }

  async insertUser(user) {
    return await userDataBase.insertUser(user);
  }

  async updateUser(user) {
    return await userDataBase.updateUser(user);
  }

  async userComments(userId) {
    // TODO => Patrick
  }
  /*  Optional */
  // Delete profile
}

const userService = new UserService();

module.exports = userService;
