if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const commentsDatabase = require('../../src/dataBase/commentDatabase');
const testTools = require('../utils/testTools');
const { comment } = require('./models');
const { expect } = chai;

chai.use(dirtyChai);

const insertComment = async () => {
  return await commentsDatabase.insertComment(comment);
};

describe('commentDatabase.test.js', function() {
  this.timeout(10000);

  before(async () => {
    await commentsDatabase.connect();
    await commentsDatabase.clear();
  });

  beforeEach(async () => {
    await insertComment();
  });

  after(async () => {
    await commentsDatabase.close();
  });

  afterEach(async () => {
    await commentsDatabase.clear();
  });

  it('Can insert comment', async () => {
    await commentsDatabase.clear();
    let result = await commentsDatabase.insertComment(comment);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(comment);
  });

  it('Can get comments by bookId and userId', async () => {
    let result = await commentsDatabase.getComments(
      comment.bookId,
      comment.userId
    );

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(comment);
  });

  it('Can get comment by bookId', async () => {
    let result = await commentsDatabase.getCommentsByBookId(comment.bookId);
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can get comments by userId', async () => {
    const result = await commentsDatabase.getCommentsByUserId(comment.userId);
    expect(result.length).to.be.greaterThan(0);
  });

  it('Can insert comment when first update comment', async () => {
    await commentsDatabase.clear();
    const newCommentStart = {
      bookId: comment.bookId,
      userId: comment.userId,
      text: 'Bla bla bla'
    };
    let result = await commentsDatabase.updateComment(newCommentStart);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(newCommentStart);
  });

  it('Can update comment', async () => {
    const newCommentStart = {
      bookId: comment.bookId,
      userId: comment.userId,
      text: 'Bla bla bla'
    };
    let result = await commentsDatabase.updateComment(newCommentStart);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(newCommentStart);
  });

  it('Can delete comment', async () => {
    await commentsDatabase.deleteComment(comment.bookId, comment.userId);

    const result = await commentsDatabase.getComments(
      comment.bookId,
      comment.userId
    );

    expect(result).to.be.null();
  });

  it('Can delete comment by bookId', async () => {
    await commentsDatabase.deleteCommentsByBookId(comment.bookId);

    const result = await commentsDatabase.getComments(
      comment.bookId,
      comment.userId
    );

    expect(result).to.be.null();
  });

  it('Can delete comment by userId', async () => {
    await commentsDatabase.deleteCommentsByUserId(comment.userId);

    const result = await commentsDatabase.getComments(
      comment.bookId,
      comment.userId
    );

    expect(result).to.be.null();
  });
});
