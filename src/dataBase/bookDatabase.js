const Book = require('../models/books');
const tools = require('../utils/tools');
const { DataBase } = require('./database');
const mongoose = require('mongoose');

const CACHE_TIME = parseInt(process.env.CACHE_TIME);

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
    this.createResultBook = this.createResultBook.bind(this);
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
  insertBook(book) {
    // Custom save or update
    return Book.findOne({
      id: book.id
    })
      .then(findBook => {
        if (findBook === null) {
          const dbBook = new Book({
            id: mongoose.Types.ObjectId(book.id),
            cache_timestamp: book.cache_timestamp,
            authors: book.authors,
            title: book.title,
            summary: book.summary,
            published_date: book.published_date,
            thumbnail: book.thumbnail
          });

          return this.saveInDB(dbBook);
        } else if (tools.delay(findBook.cache_timestamp) > CACHE_TIME) {
          findBook.cache_timestamp = new Date();
          return this.updateBook(findBook);
        } else {
          return findBook;
        }
      })
      .catch(error => {
        /* istanbul ignore next */
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
  getBooks(text, limit) {
    return Book.search(text)
      .limit(limit)
      .then(results => {
        return results.map(result => (result = this.createResultBook(result)));
      })
      .catch(error => {
        /* istanbul ignore next */
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
  getBook(id) {
    return Book.findOne({
      id: id
    })
      .then(result => {
        return this.createResultBook(result);
      })
      .catch(error => {
        /* istanbul ignore next */
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
  /* istanbul ignore next */
  insertBooks(books) {
    books.map(book => this.insertBook(book));
  }

  createResultBook(dbBook) {
    const book = {
      id: bookDatabase.revertId(dbBook.id.id),
      cache_timestamp: dbBook.cache_timestamp,
      authors: dbBook.authors,
      title: dbBook.title,
      summary: dbBook.summary,
      published_date: dbBook.published_date,
      thumbnail: dbBook.thumbnail
    };

    return book;
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
  updateBook(book) {
    return Book.findOneAndUpdate(
      {
        id: book.id
      },
      book,
      {
        runValidators: true,
        new: true
      }
    )
      .then(result => {
        return this.createResultBook(result);
      })
      .catch(error => {
        /* istanbul ignore next */
        console.log(error);
      });
  }
}

const bookDatabase = new BookDatabase({});

module.exports = bookDatabase;
