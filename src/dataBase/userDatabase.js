const User = require('../models/users');

const {
    DataBase
} = require('./database');

/* **********************************************************************************************
 *
 * @class DataBase
 * @description DataBase class is the class that is used to connect and manage the mongoDB DataBase
 *
 *********************************************************************************************** */
class UserDatabase extends DataBase {
    constructor() {
        super();
        this.insertUser = this.insertUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    /* *************************************************************
     *
     * @function insertUser(user, done)
     * @param user The user to insert
     * @param done Use only this for testing callback
     * @return A Promise which you can catch the saved user with a then()
     * @description construction and insertion of a user in DB
     *
     ************************************************************ */
    insertUser(user, done) {
        const dbUser = new User({
            id: user.id,
            login: user.login,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            avatar: user.avatar,
            comments: user.comments
        });

        return this.saveInDB(dbUser, done);
    }

    /* *************************************************************
     *
     * @function getUser(id, done)
     * @param id The user's id to fetch
     * @param done Use only this for testing callback
     * @return A Promise which you can catch the user with a then()
     * @description construction and insertion of a user in DB
     *
     ************************************************************ */
    getUser(id, done) {
        return User.findOne({
                id
            })
            .then(result => {
                if (typeof done === 'function') done();
                return result;
            })
            .catch(error => {
                if (typeof done === 'function') done();
                console.log(error);
            });
    }

    /* *************************************************************
     *
     * @function updateUser()
     * @param user The user to update
     * @param done Use only this for testing callback
     * @return A Promise which you can catch the updated user with a then()
     * @description Update a user
     *
     ************************************************************ */
    updateUser(user, done) {
        return Book.findOneAndUpdate({
                id: user.id
            }, user, {
                runValidators: true
            })
            .then(result => {
                if (typeof done === 'function') done();
                return result;
            })
            .catch(error => {
                if (typeof done === 'function') done();
                console.log(error);
            });
    }
}

const bookService = new BookService();

module.exports = bookService;