const bookStarsDatabase = require('../dataBase/bookStarsDatabase');

/**
 * BookStars Service
 *
 * @class BookStarsService
 */
class BookStarsService {
  constructor() {
    this.createBookStars = this.createBookStars.bind(this);
    this.insertBookStars = this.insertBookStars.bind(this);
    this.updateBookStars = this.updateBookStars.bind(this);
    this.getBookStars = this.getBookStars.bind(this);
    this.getBookStarsByBookId = this.getBookStarsByBookId.bind(this);
    this.getBookStarsByUserId = this.getBookStarsByUserId.bind(this);
    this.deleteBookStars = this.deleteBookStars.bind(this);
    this.deleteBookStarsByBookId = this.deleteBookStarsByBookId.bind(this);
    this.deleteBookStarsByUserId = this.deleteBookStarsByUserId.bind(this);
  }

  /**
   * Create a bookstars
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @param {*} note The note
   * @returns A bookstars json object
   * @memberof BookStarsService
   */
  createBookStars(bookId, userId, note) {
    return {
      bookId: bookId,
      userId: userId,
      note: note
    };
  }

  /**
   * Insert a bookStars
   *
   * @param {*} bookStars The bookstars to insert
   * @returns The inserted Bookstars
   * @memberof BookStarsService
   */
  async insertBookStars(bookStars) {
    return await bookStarsDatabase.insertBookStars(bookStars);
  }

  /**
   * Update a bookStars
   *
   * @param {*} bookStars The bookstars to update
   * @returns The updated bookstars
   * @memberof BookStarsService
   */
  async updateBookStars(bookStars) {
    return await bookStarsDatabase.updateBookStars(bookStars);
  }

  /**
   * Get a bookstars which match with bookId and userId
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @returns The bookstars which match with bookId and userId
   * @memberof BookStarsService
   */
  async getBookStars(bookId, userId) {
    const result = await bookStarsDatabase.getBookStars(bookId, userId);
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
   * Get all bookstars which match with bookId
   *
   * @param {*} bookId The bookId
   * @returns The bookstars which match with bookId
   * @memberof BookStarsService
   */
  async getBookStarsByBookId(bookId) {
    return await bookStarsDatabase.getBookStarsByBookId(bookId);
  }

  /**
   * Get all bookstars which match with userId
   *
   * @param {*} userId The userId
   * @returns The bookstars which match with userId
   * @memberof BookStarsService
   */
  async getBookStarsByUserId(userId) {
    return await bookStarsDatabase.getBookStarsByUserId(userId);
  }

  /**
   * Delete a bookstars which match with bookId and userId
   *
   * @param {*} bookId The bookId
   * @param {*} userId The userId
   * @returns Null if the bookstars was deleted succefuly
   * @memberof BookStarsService
   */
  async deleteBookStars(bookId, userId) {
    return await bookStarsDatabase.deleteBookStars(bookId, userId);
  }

  /**
   * Delete all bookstars which match with bookId
   *
   * @param {*} bookId The bookId
   * @returns Null if the bookstars was deleted succefuly
   * @memberof BookStarsService
   */
  async deleteBookStarsByBookId(bookId) {
    return await bookStarsDatabase.deleteBookStarsByBookId(bookId);
  }

  /**
   * Delete all bookstars which match with userId
   *
   * @param {*} userId The userId
   * @returns Null if the bookstars was deleted succefuly
   * @memberof BookStarsService
   */
  async deleteBookStarsByUserId(userId) {
    return await bookStarsDatabase.deleteBookStarsByUserId(userId);
  }
}

const bookStarsService = new BookStarsService();

module.exports = bookStarsService;
