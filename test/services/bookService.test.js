if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const { db } = require('../../src/dataBase/database');
const bookDatabase = require('../../src/dataBase/bookDatabase');
const bookStarsDatabase = require('../../src/dataBase/bookStarsDatabase');
const bookService = require('../../src/services/bookService');
const { book, bookStars } = require('../dataBase/models');
const testTools = require('../utils/testTools');

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;

chai.use(dirtyChai);

const insertBook = async () => {
  await bookDatabase.insertBook(book);
};

const insertBookStars = async () => {
  await bookStarsDatabase.insertBookStars(bookStars);
};

describe('bookService.test.js', function() {
  this.timeout(10000);

  const limit = 5;

  before(async () => {
    await db.connect();
    await db.clear();
  });

  after(async () => {
    await db.close();
  });

  afterEach(async () => {
    await db.clear();
  });

  it('Can search book', async () => {
    const results = await bookService.searchOnline(
      'The lord of the rings',
      limit
    );
    expect(results.length).to.be.deep.equal(limit);
  });

  it('Can get books from searchOnline', async () => {
    const results = await bookService.getBooks('The lord of the rings', limit);
    expect(results.length).to.be.deep.equal(limit);
  });

  it('Can get books from cache', async () => {
    const results = await bookService.getBooks('The lord of the rings', limit);
    expect(results.length).to.be.deep.equal(limit);

    const secondResults = await bookService.getBooks(
      'The lord of the rings',
      limit
    );
    /* Sort to be sure to compare the same book*/
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
      expect(book.id).to.be.deep.equal(results[i].id);
      expect(book.title).to.be.deep.equal(results[i].title);
    });
  });

  it('Can get book by id', async () => {
    const results = await bookService.searchOnline(
      'The lord of the rings',
      limit
    );
    expect(results.length).to.be.deep.equal(limit);
    const book = results[0];

    const secondResults = await bookService.getBook(book.id);
    expect(secondResults).to.not.be.null();
    expect(secondResults.id).to.be.deep.equal(book.id);
    expect(secondResults.title).to.be.deep.equal(book.title);
  });

  it('Can get best books', async () => {
    await insertBook();
    const results = await bookService.getBestBook(5);

    expect(results.length).to.be.greaterThan(0);
  });

  it('Book average should be zero if has no bookStars', async () => {
    await insertBook();
    const result = await bookService.getBookAverageNote(book.id);

    expect(result).to.be.deep.equal(0);
  });

  it('Book average should have a note average if has bookStars', async () => {
    await insertBook();
    await insertBookStars();
    const result = await bookService.getBookAverageNote(book.id);

    expect(result).to.be.deep.equal(bookStars.note);
  });

  it('Can get book`s comment by id', async () => {});
});
