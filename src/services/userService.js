const userDataBase = require('../dataBase/userDatabase');

class UserService {
  // Get profile
  getUser(userId) {}
  // update profile
  updateUser(user) {}
  // change password
  changeUserPassword(newPassword) {}
  // retrive all comments
  userComments(userId) {}

  /*  Optional */
  // Delete profile
}

const userService = new UserService();

module.exports = userService;
