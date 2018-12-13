const Book = require('../models/books');
const tools = require('../utils/tools');
const {
  DataBase
} = require('./database');

// change this value if you want more or less time in cache
const TIME_IN_CACHE = 5;
const CACHE_TIME = process.env.NODE_MODE === 'test' ? 5 : TIME_IN_CACHE;

/* **********************************************************************************************
 *
 * @class DataBase
 * @description DataBase class is the class that is used to connect and manage the mongoDB DataBase
 *
 *********************************************************************************************** */
class BookDatabase extends DataBase {
  constructor() {
    super();
    this.insertBook = this.insertBook.bind(this);
    this.insertBooks = this.insertBooks.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
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
  insertBook(book, done) {
    // Custom save or update
    return Book.findOne({
        id: book.id
      })
      .then(findBook => {
        if (findBook === null) {
          const dbBook = new Book({
            id: book.id,
            cache_timestamp: book.cache_timestamp,
            authors: book.authors,
            title: book.title,
            summary: book.summary,
            published_date: book.published_date,
            thumbnail: book.thumbnail
          });

          return this.saveInDB(dbBook, done);
        } else {
          if (tools.delay(findBook.cache_timestamp) > CACHE_TIME) {
            findBook.cache_timestamp = new Date();
            return this.updateBook(findBook, done);
          }
        }
      })
      .catch(error => {
        if (typeof done === 'function') done();
        console.log(error);
      });
  }

  /* *************************************************************
   *
   * @function getBooks(title, done)
   * @param id The book's title to fetch
   * @param done Use only this for testing callback
   * @return A Promise which you can catch the books with a then()
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  getBooks(text, limit, done) {
    return Book.search(text)
      .limit(limit)
      .then(results => {
        if (typeof done === 'function') done();
        return results;
      })
      .catch(error => {
        if (typeof done === 'function') done();
        console.log(error);
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
  getBook(id, done) {
    return Book.findOne({
        id: id
      })
      .then(result => {
        if (typeof done === 'function') done();
        return result;
      })
      .catch(error => {
        if (typeof done === 'function') done();
        console.log(error);
      });
  }

  /* *************************************************************
   *
   * @function insertBook(book, done)
   * @param book The book to insert
   * @param done Use only this for testing callback
   * @description construction and insertion of a book in DB
   *
   ************************************************************ */
  insertBooks(books, done) {
    books.map(book => this.insertBook(book));
    if (typeof done === 'function') done();
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
  updateBook(book, done) {
    return Book.findOneAndUpdate({
        id: book.id
      }, book, {
        runValidators: true
      })
      .then(result => {
        if (typeof done === 'function') done();
        return result;
      })
      .catch(error => {
        if (typeof done === 'function') done();
        console.log(error);
      });
  }
}

const bookDatabase = new BookDatabase({});

module.exports = bookDatabase;