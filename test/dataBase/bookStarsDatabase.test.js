if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const bookStarsDatabse = require('../../src/dataBase/bookStarsDatabase');
const testTools = require('../utils/testTools');
const { bookStars } = require('./models');
const { expect } = chai;

chai.use(dirtyChai);

const insertBookStars = async () => {
  return await bookStarsDatabse.insertBookStars(bookStars);
};

describe('bookStarsDatabase.test.js', function() {
  this.timeout(10000);

  before(async () => {
    await bookStarsDatabse.connect();
    await bookStarsDatabse.clear();
  });

  beforeEach(async () => {
    await insertBookStars();
  });

  after(async () => {
    await bookStarsDatabse.close();
  });

  afterEach(async () => {
    await bookStarsDatabse.clear();
  });

  it('Can insert book stars', async () => {
    await bookStarsDatabse.clear();
    let result = await bookStarsDatabse.insertBookStars(bookStars);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can get book stars by bookId and userId', async () => {
    let result = await bookStarsDatabse.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can get book stars by bookId', async () => {
    let result = await bookStarsDatabse.getBookStarsByBookId(bookStars.bookId);
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can get book stars by userId', async () => {
    const result = await bookStarsDatabse.getBookStarsByUserId(
      bookStars.userId
    );
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can update book stars', async () => {
    const newBookStart = {
      bookId: bookStars.bookId,
      userId: bookStars.userId,
      note: 6
    };
    let result = await bookStarsDatabse.updateBookStars(newBookStart);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(newBookStart);
  });

  it('Can deleteBookStars', async () => {
    await bookStarsDatabse.deleteBookStars(bookStars.bookId, bookStars.userId);

    const result = await bookStarsDatabse.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });

  it('Can deleteBookStars by bookId', async () => {
    await bookStarsDatabse.deleteBookStarsByBookId(bookStars.bookId);

    const result = await bookStarsDatabse.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });

  it('Can deleteBookStars by userId', async () => {
    await bookStarsDatabse.deleteBookStarsByUserId(bookStars.userId);

    const result = await bookStarsDatabse.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });
});
