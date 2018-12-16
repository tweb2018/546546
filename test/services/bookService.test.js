if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const bookDatabase = require('../../src/dataBase/bookDatabase');
const bookService = require('../../src/services/bookService');

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;

chai.use(dirtyChai);

// Do not chanche test order !!!!
// Test order is very important !!!
describe('bookService.test.js', function() {
  this.timeout(10000);

  const limit = 5;

  before(done => {
    bookDatabase.connect();
    bookDatabase.clear(done);
  });

  after(done => {
    bookDatabase.close(done);
  });

  it('Can search book', done => {
    bookService
      .searchOnline('The lord of the rings', limit)
      .then(results => {
        expect(results.length).to.be.deep.equal(limit);
        bookDatabase.clear(done);
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can get books from searchOnline', done => {
    bookService
      .getBooks('The lord of the rings', limit)
      .then(results => {
        expect(results.length).to.be.deep.equal(limit);
        bookDatabase.clear(done);
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can get books from cache', done => {
    bookService
      .getBooks('The lord of the rings', limit)
      .then(results => {
        expect(results.length).to.be.deep.equal(limit);

        //Wait data insertion
        setTimeout(() => {
          bookService
            .getBooks('The lord of the rings', limit)
            .then(secondResults => {
              // Sort to be sure to compare the same book
              results.sort(function(a, b) {
                if (a.title < b.title) {
                  return -1;
                }
                if (a.title > b.title) {
                  return 1;
                }
                return 0;
              });
              secondResults.sort(function(a, b) {
                if (a.title < b.title) {
                  return -1;
                }
                if (a.title > b.title) {
                  return 1;
                }
                return 0;
              });
              secondResults.map((book, i) => {
                expect(book.id.id.toString()).to.be.deep.equal(results[i].id);
                expect(book.title).to.be.deep.equal(results[i].title);
              });

              bookDatabase.clear(done);
            })
            .catch(err => {
              done(new Error(err));
            });
        }, 200);
      })
      .catch(err => {
        done(new Error(err));
      });
  });

  it('Can get books by id', done => {
    bookService.searchOnline('The lord of the rings', limit).then(results => {
      expect(results.length).to.be.deep.equal(limit);
      const book = results[0];

      //Wait data insertion
      setTimeout(() => {
        bookService
          .getBook(book.id)
          .then(secondResults => {
            expect(secondResults.id.id.toString()).to.be.deep.equal(book.id);
            expect(secondResults.title).to.be.deep.equal(book.title);
            bookDatabase.clear(done);
          })
          .catch(err => {
            done(new Error(err));
          });
      }, 200);
    });
  });

  it('Can get book`s comment by id', done => {
    done();
  });
});
