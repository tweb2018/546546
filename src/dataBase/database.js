// const Schema = require('./src/User.js');
const mongoose = require('mongoose');
// To Avoid findAndModify is deprecated
mongoose.set('useFindAndModify', false);
// To Avoid collection.ensureIndex is deprecated is deprecated
mongoose.set('useCreateIndex', true);

/**
 * Database features
 *
 * @class DataBase
 */
class DataBase {
  constructor() {
    this.dbName = process.env.DB_NAME;
    this.dbUrl = process.env.DB_URL;
    this.db = null;

    this.connect = this.connect.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.saveInDB = this.saveInDB.bind(this);
  }

  /**
   * initialize db connection
   *
   * @memberof DataBase
   */
  async connect() {
    /* istanbul ignore if */
    if (process.env.NODE_MODE !== 'test') {
      mongoose.connect(
        `${this.dbUrl}/${this.dbName}`,
        {
          useNewUrlParser: true
        }
      );
    } else {
      await mongoose.connect(
        `${this.dbUrl}/${this.dbName}`,
        {
          useNewUrlParser: true
        }
      );
    }

    this.db = mongoose.connection;

    this.db.once('close', () => {
      console.log('Disconnected from DB');
    });
    /* istanbul ignore next */
    this.db.on('error', () => {
      console.error.bind(console, 'Connection error: ');
      this.close();
    });
    this.db.once('open', () => {
      console.log('Connected to DB => OK');
    });
  }

  /**
   * Use for test purpose to close the connection
   *
   * @returns A Promise which you can catch the saved book with a then()
   * @memberof DataBase
   */
  async close() {
    return await this.db.close();
  }

  /**
   * Clear the database - for test purpose
   *
   * @returns A Promise which you can catch the saved book with a then()
   * @memberof DataBase
   */
  async clear() {
    return await this.db.dropDatabase();
  }

  /**
   * Save the value in DB
   *
   * @param {*} value The value to save
   * @returns A Promise which you can catch the saved book with a then()
   * @memberof DataBase
   */
  async saveInDB(value) {
    return value.save();
  }
}

const db = new DataBase({});

module.exports = {
  db,
  DataBase
};
