const BookStars = require('../models/bookStars');
const { DataBase } = require('./database');

/* **********************************************************************************************
 *
 * @class DataBase
 * @description DataBase class is the class that is used to connect and manage the mongoDB DataBase
 *
 *********************************************************************************************** */
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

  /* *************************************************************
   *
   * @function insertBook(book, done)
   * @param book The book to insert
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the saved book with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  async insertBookStars(bookStars) {
    const dbBookStars = new BookStars({
      bookId: bookStars.bookId,
      userId: bookStars.userId,
      note: bookStars.note
    });

    return await this.saveInDB(dbBookStars);
  }

  /* *************************************************************
   *
   * @function getBook(id, done)
   * @param id The book's id to fetch
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the book with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  async getBookStars(bookId, userId) {
    return await BookStars.findOne({
      bookId: bookId,
      userId: userId
    });
  }

  /* *************************************************************
   *
   * @function getBook(id, done)
   * @param id The book's id to fetch
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the book with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  async getBookStarsByBookId(bookId) {
    return await this.getAllBookStars({
      bookId: bookId
    });
  }

  /* *************************************************************
   *
   * @function getBook(id, done)
   * @param id The book's id to fetch
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the book with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  async getBookStarsByUserId(userId) {
    return await this.getAllBookStars({
      userId: userId
    });
  }

  /* *************************************************************
   *
   * @function getBook(id, done)
   * @param id The book's id to fetch
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the book with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  async getAllBookStars(options = {}) {
    return await BookStars.find(options);
  }

  /* *************************************************************
   *
   * @function updateBook()
   * @param book The book to update
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the updated book with a then()
   * @description Update a book
   *
   ************************************************************ */
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
    return result;
  }

  async deleteBookStars(bookId, userId) {
    return await BookStars.deleteOne({
      bookId: bookId,
      userId: userId
    });
  }

  async deleteBookStarsByBookId(bookId) {
    return await BookStars.deleteMany({
      bookId: bookId
    });
  }

  async deleteBookStarsByUserId(userId) {
    return await BookStars.deleteMany({
      userId: userId
    });
  }
}

const bookStarsDatabase = new BookStarsDatabase({});

module.exports = bookStarsDatabase;
