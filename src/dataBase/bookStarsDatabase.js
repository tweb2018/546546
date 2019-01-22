const BookStars = require('../models/bookStars');
const { DataBase } = require('./database');

/**
 * BookStars database features
 *
 * @class BookStarsDatabase
 * @extends {DataBase}
 */
class BookStarsDatabase extends DataBase {
  constructor() {
    super();
    this.insertBookStars = this.insertBookStars.bind(this);
    this.updateBookStars = this.updateBookStars.bind(this);
    this.getBookStars = this.getBookStars.bind(this);
    this.getBookStarsByBookId = this.getBookStarsByBookId.bind(this);
    this.getBookStarsByUserId = this.getBookStarsByUserId.bind(this);
    this.getAllBookStars = this.getAllBookStars.bind(this);
    this.deleteBookStars = this.deleteBookStars.bind(this);
  }

  /**
   * Insert a bookstars in the database
   *
   * @param {*} bookStars The bookstars to insert
   * @returns The inserted bookstars
   * @memberof BookStarsDatabase
   */
  async insertBookStars(bookStars) {
    const dbBookStars = new BookStars({
      bookId: bookStars.bookId,
      userId: bookStars.userId,
      note: bookStars.note
    });

    return await this.saveInDB(dbBookStars);
  }

  /**
   * Get the bookstars which match with the bookId and userId
   *
   * @param {*} bookId The book id
   * @param {*} userId The user id
   * @returns The bookstars which match with the bookId and userId
   * @memberof BookStarsDatabase
   */
  async getBookStars(bookId, userId) {
    return await BookStars.findOne({
      bookId: bookId,
      userId: userId
    });
  }

  /**
   * Get the bookstars which match with the bookId
   *
   * @param {*} bookId The book id
   * @returns The bookstars which match with the bookId
   * @memberof BookStarsDatabase
   */
  async getBookStarsByBookId(bookId) {
    return await this.getAllBookStars({
      bookId: bookId
    });
  }

  /**
   * Get the bookstars which match with the userId
   *
   * @param {*} userId The user id
   * @returns The bookstars which match with the userId
   * @memberof BookStarsDatabase
   */
  async getBookStarsByUserId(userId) {
    return await this.getAllBookStars({
      userId: userId
    });
  }

  /**
   * Fetch all bookstars
   *
   * @param {*} [options={}] Options when fetching
   * @returns A list of all bookstars
   * @memberof BookStarsDatabase
   */
  async getAllBookStars(options = {}) {
    return await BookStars.find(options);
  }

  /**
   * update a bookstars
   *
   * @param {*} bookStars The bookstars to update
   * @returns The updated bookstars
   * @memberof BookStarsDatabase
   */
  async updateBookStars(bookStars) {
    const result = await BookStars.findOneAndUpdate(
      {
        bookId: bookStars.bookId,
        userId: bookStars.userId
      },
      bookStars,
      {
        runValidators: true,
        new: true
      }
    );

    if (result === null) {
      return await this.insertBookStars(bookStars);
    }

    return result;
  }

  /**
   * Delete a bookstars which match with bookId and userId
   *
   * @param {*} bookId The book id
   * @param {*} userId The user id
   * @returns Null if the book was succefuly deleted
   * @memberof BookStarsDatabase
   */
  async deleteBookStars(bookId, userId) {
    return await BookStars.deleteOne({
      bookId: bookId,
      userId: userId
    });
  }

  /**
   * Delete all bookstars which match with bookId
   *
   * @param {*} bookId The book id
   * @returns Null if the book was succefuly deleted
   * @memberof BookStarsDatabase
   */
  async deleteBookStarsByBookId(bookId) {
    return await BookStars.deleteMany({
      bookId: bookId
    });
  }

  /**
   * Delete all bookstars which match with userId
   *
   * @param {*} userId The user id
   * @returns Null if the book was succefuly deleted
   * @memberof BookStarsDatabase
   */
  async deleteBookStarsByUserId(userId) {
    return await BookStars.deleteMany({
      userId: userId
    });
  }
}

const bookStarsDatabase = new BookStarsDatabase({});

module.exports = bookStarsDatabase;
