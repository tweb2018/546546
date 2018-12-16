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

  describe('Create Database', () => {
    it('Can create database', done => {
      db = new DataBase({});
      expect(db).to.not.be.undefined();
      done();
    });
  });

  describe('Connect Database', () => {
    it('Can connect to database', done => {
      db.connect();
      db.clear(done);
    });
  });

  describe('Save data to Database', () => {
    it('Can save data to Database', done => {
      const dbBook = new Book({
        id: book.id,
        cache_timestamp: book.cache_timestamp,
        authors: book.authors,
        title: book.title,
        summary: book.summary,
        published_date: book.published_date,
        thumbnail: book.thumbnail
      });

      db.saveInDB(dbBook)
        .then(result => {
          expect(result).to.not.be.undefined();
          expect(result.id).to.be.equal(book.id);
          expect(result.title).to.be.deep.equal(book.title);
          done();
        })
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('Drop Database', () => {
    it('Can drop database', done => {
      db.clear(done);
    });
  });

  describe('Diconnect Database', () => {
    it('Can disconnect to database', done => {
      db.close(done);
    });
  });
});
