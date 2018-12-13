const userDataBase = require('../dataBase/userDatabase');

class UserService {
  getUser(id) {
    return userDataBase
      .getUser(id)
      .then(result => {
        return result;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  insertUser(user) {
    return userDataBase.insertUser(user)
      .then(result => {
        return result;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  updateUser(user) {
    return bookDatabase
      .updateUser(user)
      .then(result => {
        return result;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  userComments(userId) {
    // TODO => Patrick
  }
  /*  Optional */
  // Delete profile
}

const userService = new UserService();

module.exports = userService;