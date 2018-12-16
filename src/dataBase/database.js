// const Schema = require('./src/User.js');
const Mongoose = require('mongoose');
// To Avoid findAndModify is deprecated
Mongoose.set('useFindAndModify', false);
// To Avoid collection.ensureIndex is deprecated is deprecated
Mongoose.set('useCreateIndex', true);

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
    this.dbUrl = process.env.DB_URL;
    this.db = null;

    this.connect = this.connect.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.saveInDB = this.saveInDB.bind(this);
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
    return this.db.close(done);
  }

  /* *************************************************************
   *
   * @function clear()
   * @description clear the database - for test purpose
   *
   ************************************************************ */
  clear(done) {
    return this.db.dropDatabase(done);
  }

  /* *************************************************************
   *
   * @function saveInDB
   * @param value The value to save
   * @return A Promise which you can catch the saved book with a then()
   * @description save the value in DB
   *
   ***************************************************************** */
  saveInDB(value, done) {
    return value
      .save()
      .then(result => {
        if (typeof done === 'function') done();
        return result;
      })
      .catch(error => {
        // Difficult to test
        /* istanbul ignore next */
        {
          console.log(error);
          if (typeof done === 'function') done();
        }
      });
  }
}

const db = new DataBase({});

module.exports = {
  db,
  DataBase
};
