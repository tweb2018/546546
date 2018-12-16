if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const bookDatabase = require('../../src/dataBase/bookDatabase');
const { book } = require('./models');
const { expect } = chai;
const CACHE_TIME = parseInt(process.env.CACHE_TIME);

chai.use(dirtyChai);

describe('bookDatabase.test.js', function() {
  this.timeout(10000);

  before(done => {
    bookDatabase.connect();
    bookDatabase.clear(done);
  });

  after(done => {
    bookDatabase.close(done);
  });

  it('Can insert book', done => {
    bookDatabase
      .insertBook(book)
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

  it('Can get books', done => {
    bookDatabase
      .getBooks('', 100)
      .then(result => {
        expect(result.length).to.be.greaterThan(0);
        done();
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can get book by id', done => {
    bookDatabase
      .getBook(book.id)
      .then(result => {
        expect(result).to.not.be.undefined();
        expect(result.id.id.toString()).to.be.equal(book.id.id);
        expect(result.title).to.be.deep.equal(book.title);
        done();
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can update book', done => {
    book.title = 'new_title';
    bookDatabase
      .updateBook(book)
      .then(result => {
        expect(result).to.not.be.undefined();
        expect(result.id.id.toString()).to.be.equal(book.id.id);
        expect(result.title).to.be.deep.equal(book.title);
        done();
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can refresh book cache', done => {
    setTimeout(() => {
      bookDatabase
        .insertBook(book)
        .then(result => {
          expect(result).to.not.be.undefined();
          expect(result.cache_timestamp).to.be.greaterThan(
            book.cache_timestamp
          );
          book.cache_timestamp = result.cache_timestamp;
          done();
        })
        .catch(err => {
          done(new Error(err));
        });
    }, CACHE_TIME * 1000);
  });

  it('Can get book from cache', done => {
    bookDatabase
      .insertBook(book)
      .then(result => {
        expect(result).to.not.be.undefined();
        expect(result.cache_timestamp).to.be.deep.equal(book.cache_timestamp);
        done();
      })
      .catch(err => {
        done(new Error(err));
      });
  });
});
