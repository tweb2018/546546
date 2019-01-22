const Comment = require('../models/comment');
const { DataBase } = require('./database');

/**
 * Comments database features
 *
 * @class CommentsDatabase
 * @extends {DataBase}
 */
class CommentsDatabase extends DataBase {
  constructor() {
    super();
    this.insertComment = this.insertComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getCommentsByBookId = this.getCommentsByBookId.bind(this);
    this.getCommentsByUserId = this.getCommentsByUserId.bind(this);
    this.getAllComments = this.getAllComments.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  /**
   * Insert a comment in the database
   *
   * @param {*} comment The comment to insert
   * @returns The inserted comment
   * @memberof CommentsDatabse
   */
  async insertComment(comment) {
    const dbComment = new Comment({
      bookId: comment.bookId,
      userId: comment.userId,
      text: comment.text
    });

    return await this.saveInDB(dbComment);
  }

  /**
   * Get the comments which match with the bookId and userId
   *
   * @param {*} bookId The book id
   * @param {*} userId The user id
   * @returns The comments which match with the bookId and userId
   * @memberof CommentsDatabase
   */
  async getComments(bookId, userId) {
    return await Comment.findOne({
      bookId: bookId,
      userId: userId
    });
  }

  /**
   * Get the comments which match with the bookId
   *
   * @param {*} bookId The book id
   * @returns The comments which match with the bookId
   * @memberof CommentsDatabase
   */
  async getCommentsByBookId(bookId) {
    return await this.getAllComments({
      bookId: bookId
    });
  }

  /**
   * Get the comments which match with the userId
   *
   * @param {*} userId The user id
   * @returns The comments which match with the userId
   * @memberof CommentsDatabase
   */
  async getCommentsByUserId(userId) {
    return await this.getAllComments({
      userId: userId
    });
  }

  /**
   * Fetch all comment
   *
   * @param {*} [options={}] Options when fetching
   * @returns A list of all comments
   * @memberof CommentsDatabase
   */
  async getAllComments(options = {}) {
    return await Comment.find(options);
  }

  /**
   * update a comment
   *
   * @param {*} comment The comment to update
   * @returns The updated comment
   * @memberof CommentsDatabase
   */
  async updateComment(comment) {
    const result = await Comment.findOneAndUpdate(
      {
        bookId: comment.bookId,
        userId: comment.userId
      },
      comment,
      {
        runValidators: true,
        new: true
      }
    );

    if (result === null) {
      return await this.insertComment(comment);
    }

    return result;
  }

  /**
   * Delete a comments which match with bookId and userId
   *
   * @param {*} bookId The book id
   * @param {*} userId The user id
   * @returns Null if the comment was succefuly deleted
   * @memberof CommentsDatabase
   */
  async deleteComment(bookId, userId) {
    return await Comment.deleteOne({
      bookId: bookId,
      userId: userId
    });
  }

  /**
   * Delete all comment which match with bookId
   *
   * @param {*} bookId The book id
   * @returns Null if the book was succefuly deleted
   * @memberof CommentsDatabase
   */
  async deleteCommentsByBookId(bookId) {
    return await Comment.deleteMany({
      bookId: bookId
    });
  }

  /**
   * Delete all comments which match with userId
   *
   * @param {*} userId The user id
   * @returns Null if the book was succefuly deleted
   * @memberof CommentsDatabase
   */
  async deleteCommentsByUserId(userId) {
    return await Comment.deleteMany({
      userId: userId
    });
  }
}

const commentsDatabase = new CommentsDatabase({});

module.exports = commentsDatabase;
