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
const testTools = require('../utils/testTools');
const { book } = require('./models');
const { expect } = chai;
const CACHE_TIME = parseInt(process.env.CACHE_TIME);

chai.use(dirtyChai);

const insertBook = async () => {
  return bookDatabase.insertBook(book);
};

describe('bookDatabase.test.js', function() {
  this.timeout(10000);

  before(async () => {
    await bookDatabase.connect();
    await bookDatabase.clear();
  });

  beforeEach(async () => {
    await insertBook();
  });

  after(async () => {
    await bookDatabase.close();
  });

  afterEach(async () => {
    await bookDatabase.clear();
  });

  it('Can insert book', async () => {
    await bookDatabase.clear();

    let result = await bookDatabase.insertBook(book);
    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(book);
  });

  it('Can search books', async () => {
    const result = await bookDatabase.searchBooks('', 5);
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can get book by id', async () => {
    let result = await bookDatabase.getBook(book.id);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(book);
  });

  it('Can update book', async () => {
    book.title = 'new_title';
    let result = await bookDatabase.updateBook(book);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(book);
  });

  it('Can refresh book cache', async () => {
    await testTools.sleep(CACHE_TIME * 1000);
    let result = await bookDatabase.insertBook(book);

    result = testTools.deleteMongooseId(result);

    expect(result.cache_timestamp).to.be.greaterThan(book.cache_timestamp);
    book.cache_timestamp = result.cache_timestamp;
  });

  it('Can get book from cache', async () => {
    const result = await bookDatabase.insertBook(book);
    const cacheResult = await bookDatabase.getBook(book.id);

    expect(result.cache_timestamp).to.be.deep.equal(
      cacheResult.cache_timestamp
    );
  });

  it('Can return book from cache when insertion and timestamp valid', async () => {
    const result = await bookDatabase.insertBook(book);
    const cacheResult = await bookDatabase.insertBook(book);

    expect(result.cache_timestamp).to.be.deep.equal(
      cacheResult.cache_timestamp
    );
  });

  it('Can get all books', async () => {
    const results = await bookDatabase.getAllBooks(book);
    expect(results.length).to.be.deep.greaterThan(0);
  });
});
