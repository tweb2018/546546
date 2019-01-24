const userDataBase = require('../dataBase/userDatabase');
const commentDatabase = require('../dataBase/commentDatabase');

class UserService {
  async getUser(id) {
    console.log('User id to look in DB', id);
    return await userDataBase.getUser(id);
  }

  async insertUser(user) {
    return await userDataBase.insertUser(user);
  }

  async updateUser(user) {
    return await userDataBase.updateUser(user);
  }

  async userComments(userId) {
    return await commentDatabase.getCommentsByUserId(userId);
  }
  /*  Optional */
  // Delete profile
}

const userService = new UserService();

module.exports = userService;
