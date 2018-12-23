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
const bookStarsService = require('../../src/services/bookStarsSevice');
const testTools = require('../utils/testTools');
const { bookStars } = require('../dataBase/models');
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

  it('Can create book stars', () => {
    const result = bookStarsService.createBookStars(
      bookStars.bookId,
      bookStars.userId,
      bookStars.note
    );

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can create bookStars from existing bookStars', async () => {
    const result = await bookStarsService.createBookStarsFromExistingBookStars(
      bookStars
    );

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can insert bookStars', async () => {
    await bookStarsDatabse.clear();
    let result = await bookStarsService.insertBookStars(bookStars);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can update book stars', async () => {
    const newBookStart = {
      bookId: bookStars.bookId,
      userId: bookStars.userId,
      note: 6
    };
    let result = await bookStarsService.updateBookStars(newBookStart);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(newBookStart);
  });

  it('Can get book stars by bookId and userId', async () => {
    let result = await bookStarsService.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(bookStars);
  });

  it('Can get book stars by bookId', async () => {
    let result = await bookStarsService.getBookStarsByBookId(bookStars.bookId);
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can get book stars by userId', async () => {
    const result = await bookStarsService.getBookStarsByUserId(
      bookStars.userId
    );
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can deleteBookStars', async () => {
    await bookStarsService.deleteBookStars(bookStars.bookId, bookStars.userId);

    const result = await bookStarsService.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });

  it('Can deleteBookStars by bookId', async () => {
    await bookStarsService.deleteBookStarsByBookId(bookStars.bookId);

    const result = await bookStarsService.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });

  it('Can deleteBookStars by userId', async () => {
    await bookStarsService.deleteBookStarsByUserId(bookStars.userId);

    const result = await bookStarsService.getBookStars(
      bookStars.bookId,
      bookStars.userId
    );

    expect(result).to.be.null();
  });
});
