const commentsDatabase = require('../dataBase/commentDatabase');

/**
 * Comments Service
 *
 * @class CommentsService
 */
class CommentsService {
  constructor() {
    this.createComments = this.createComment.bind(this);
    this.insertComments = this.insertComment.bind(this);
    this.updateComments = this.updateComment.bind(this);
    this.getComments = this.getComment.bind(this);
    this.getCommentsByBookId = this.getCommentsByBookId.bind(this);
    this.getCommentsByUserId = this.getCommentsByUserId.bind(this);
    this.deleteComments = this.deleteComments.bind(this);
    this.deleteCommentsByBookId = this.deleteCommentsByBookId.bind(this);
    this.deleteCommentsByUserId = this.deleteCommentsByUserId.bind(this);
  }

  /**
   * Create a comment
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @param {*} text The text of the comment
   * @returns A comment json object
   * @memberof CommentsService
   */
  createComment(bookId, userId, text) {
    return {
      bookId: bookId,
      userId: userId,
      text: text
    };
  }

  /**
   * Insert a comment
   *
   * @param {*} comment The comment to insert
   * @returns The inserted comment
   * @memberof CommentsService
   */
  async insertComment(comment) {
    return await commentDatabase.insertComment(comment);
  }

  /**
   * Update a comment
   *
   * @param {*} comment The comment to update
   * @returns The updated comment
   * @memberof CommentsService
   */
  async updateComment(comment) {
    return await commentsDatabase.updateComments(comment);
  }

  /**
   * Get a comment which match with bookId and userId
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @returns The comment which match with bookId and userId
   * @memberof CommentsService
   */
  async getComment(bookId, userId) {
    const result = await commentsDatabase.getcomments(bookId, userId);
    if (result === null) {
      return {
        bookId: bookId,
        userId: userId,
        note: 0
      };
    } else {
      return result;
    }
  }

  /**
   * Get all comments which match with bookId
   *
   * @param {*} bookId The bookId
   * @returns The comments which match with bookId
   * @memberof CommentsService
   */
  async getCommentsByBookId(bookId) {
    return await commentsDatabase.getCommentsByBookId(bookId);
  }

  /**
   * Get all comments which match with userId
   *
   * @param {*} userId The userId
   * @returns The comments which match with userId
   * @memberof CommentsService
   */
  async getCommentsByUserId(userId) {
    return await commentsDatabase.getCommentsByUserId(userId);
  }

  /**
   * Delete a comment which match with bookId and userId
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @returns Null if the comment was deleted succefuly
   * @memberof CommentsService
   */
  async deleteComments(bookId, userId) {
    return await commentsDatabase.deleteComment(bookId, userId);
  }

  /**
   * Delete all comments which match with bookId
   *
   * @param {*} bookId The bookId
   * @returns Null if the comments was deleted succefuly
   * @memberof CommentsService
   */
  async deleteCommentsByBookId(bookId) {
    return await commentsDatabase.deleteCommentsByBookId(bookId);
  }

  /**
   * Delete all comments which match with userId
   *
   * @param {*} userId The userId
   * @returns Null if the comments was deleted succefuly
   * @memberof CommentsService
   */
  async deleteCommentsByUserId(userId) {
    return await commentsDatabase.deleteCommentsByUserId(userId);
  }
}

const commentsService = new CommentsService();

module.exports = commentsService;
