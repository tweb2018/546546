if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;
const { DataBase } = require('../../src/dataBase/database');
const { book } = require('./models');
const Book = require('../../src/models/books');

chai.use(dirtyChai);

describe('database.test.js', function() {
  this.timeout(10000);

  let db;

  it('Can create database', () => {
    db = new DataBase({});
    expect(db).to.not.be.undefined();
  });

  it('Can connect to database', async () => {
    await db.connect();
    expect(db.db).to.not.be.null();
    await db.clear();
  });

  it('Can save data to Database', async () => {
    const dbBook = new Book({
      id: book.id,
      cache_timestamp: book.cache_timestamp,
      authors: book.authors,
      title: book.title,
      summary: book.summary,
      published_date: book.published_date,
      thumbnail: book.thumbnail
    });

    const result = await db.saveInDB(dbBook);
    expect(result).to.not.be.undefined();
    expect(result.id).to.be.equal(book.id);
    expect(result.title).to.be.deep.equal(book.title);
  });

  it('Can drop database', async () => {
    await db.clear();
  });

  it('Can disconnect to database', async () => {
    await db.close();
  });
});
