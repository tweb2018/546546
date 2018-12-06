// const Schema = require('./src/User.js');
const Mongoose = require('mongoose');
// To Avoid findAndModify is deprecated
Mongoose.set('useFindAndModify', false);

const User = require('../models/usersModel');

/* **********************************************************************************************
 *
 * @class DataBase
 * @description DataBase class is the class that is used to connect and manage the mongoDB DataBase
 *
 *********************************************************************************************** */
class DataBase {
  /* ****************************************************
   *
   * @constructor - constructor of the DataBase Class
   * @description - object constructor
   *
   *************************************************** */
  constructor() {
    this.dbName = process.env.DB_NAME;
    this.dbUrl =
      process.env.NODE_MODE !== 'production'
        ? 'mongodb://localhost:12345'
        : process.env.DB_URL;
    this.db = null;
  }

  // initialize db connection
  connect(done) {
    Mongoose.connect(
      `${this.dbUrl}/${this.dbName}`,
      {
        useNewUrlParser: true
      },
      done
    );

    this.db = Mongoose.connection;

    this.db.once('close', () => {
      console.log('Disconnected from DB');
    });
    // Difficult to test
    /* istanbul ignore next */
    this.db.on('error', () => {
      console.error.bind(console, 'Connection error: ');
      this.close();
    });
    this.db.once('open', () => {
      console.log('Connected to DB => OK');
    });
  }

  /* *************************************************************
   *
   * @function close()
   * @description use for test purpose to close the connection
   *
   ************************************************************ */
  close(done) {
    this.db.close(done);
  }

  /* *************************************************************
   *
   * @function clear()
   * @description clear the database - for test purpose
   *
   ************************************************************ */
  clear(done) {
    this.db.dropDatabase(done);
  }

  /* *************************************************************
   *
   * @function saveInDB(value)
   * @description save the value in DB
   *
   ***************************************************************** */
  saveInDB(value, done) {
    return value.save(err => {
      if (err) throw err.message;
      console.log('Value saved in DB');
      // for test purpose
      if (typeof done === 'function') done();
    });
  }

  /* *************************************************************
   *
   * @function insertUser()
   * @description construction and insertion of a user in DB
   *
   ************************************************************ */
  insertUser(user, done) {
    const dbUser = new User({
      id: user.id,
      creation_date: user.creation_date,
      login: user.login,
      name: user.name,
      location: user.location,
      avatar: user.avatar,
      firebaseUid: user.firebaseUid
    });

    this.saveInDB(dbUser);
  }

  /* *************************************************************
   *
   * @function getUser()
   * @description find user in DB
   * @return null or the User found in DB
   *
   ************************************************************ */
  getUser(login) {
    return User.findOne({ login })
      .then(dbUser => dbUser.toObject())
      .catch(err => {
        // Difficult to test
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          console.log(err.message);
          return null;
        }
        /* eslint-enable no-lone-blocks */
      });
  }

  /* *************************************************************
   *
   * @function updateUser()
   * @description
   * @return
   *
   ************************************************************ */
  updateUser(user, done) {
    User.findOneAndUpdate(
      { id: user.id },
      user,
      { runValidators: true },
      err => {
        // Difficult to test
        /* istanbul ignore if */
        if (err) {
          console.log(`Error during update of user ${user.login}`);
        } else {
          console.log(`Update of user ${user.login}`);
          // TODO Update queryDate of cached user
          CacheUser.findOneAndUpdate(
            { id: user.id },
            { query_date: new Date() },
            { runValidators: true },
            error => {
              // Difficult to test
              /* istanbul ignore if */
              if (error) {
                console.log(`Error during cache update ${err.message}`);
              }
              // for test purpose
              if (typeof done === 'function') done();
            }
          );
        }
      }
    );
  }
}

module.exports = DataBase;

  /* *************************************************************
   *
   * @function getBooks(title)
   * @param text The book's title
   * @description find book in DB
   * @return null or the Book found in DB
   *
   ************************************************************ */
  getBooks(text) {
    // Use Regex to make a LIKE search
    // prettier-ignore
    return Book.search(text)
      .then(dbBook => {
        return dbBook;
      })
      .catch(err => {
        // Difficult to test
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          console.log(err.message);
          return null;
        }
        /* eslint-enable no-lone-blocks */
      });
  }

  /* *************************************************************
   *
   * @function updateBook()
   * @param book The book to update
   * @param done Use only this for testing callback
   * @description Update a book
   *
   ************************************************************ */
  updateBook(book, done) {
    Book.findOneAndUpdate(
      { id: book.id },
      book,
      { runValidators: true },
      err => {
        // Difficult to test
        /* istanbul ignore if */
        if (err) {
          console.log(`Error during update of book ${book.title}`);
        } else {
          console.log(`Update of book ${book.title}`);
          // for test purpose
          if (typeof done === 'function') done();
        }
      }
    );
  }
}

const db = new DataBase({});

/* istanbul ignore if  */
if (process.env.NODE_MODE !== 'test') {
  db.connect();
}

module.exports = { db };
