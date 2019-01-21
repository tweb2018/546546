const googleBooks = require('google-books-search');
const bookDatabase = require('../dataBase/bookDatabase');
const bookStarsService = require('../services/bookStarsSevice');
const commentService = require('../services/commentService');

/**
 * Book service features
 *
 * @class BookService
 */
class BookService {
  constructor() {
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.searchOnline = this.searchOnline.bind(this);
    this.createBook = this.createBook.bind(this);
    this.getBestBook = this.getBestBook.bind(this);
    this.getBookAverageNote = this.getBookAverageNote.bind(this);
  }

  /**
   * Create a new book
   *
   * @param {*} id The book's id
   * @param {*} authors The book's authors
   * @param {*} title The book's title
   * @param {string} [summary=''] The book's summary
   * @param {*} published_date The book's published_date
   * @param {*} thumbnail The book's thumbnail
   * @returns
   * @memberof BookService
   */
  createBook(id, authors, title, summary = '', published_date, thumbnail) {
    return {
      id: id,
      cache_timestamp: new Date(),
      authors: authors,
      title: title,
      summary: summary,
      published_date: published_date,
      thumbnail: thumbnail
    };
  }

  /**
   * Search books which match with text on the google API
   *
   * @param {*} text The text to search
   * @param {number} [limit=10] The limit of book to return
   * @returns A list of Books
   * @memberof BookService
   */
  searchOnline(text, limit = 10) {
    const options = {
      limit: limit
    };

    return new Promise((resolve, reject) => {
      googleBooks.search(text, options, async (error, results) => {
        if (error === null) {
          /* Renvoie immédiat du résultat pour que l'utilisateur le recoive le plus vite possible */
          /* istanbul ignore if */
          if (process.env.NODE_MODE !== 'test') {
            resolve(results);
          }

          const searchResult = results.map(book =>
            this.createBook(
              book.id,
              book.authors,
              book.title,
              book.description || '',
              book.publishedDate,
              book.thumbnail
            )
          );

          /* istanbul ignore else */
          if (process.env.NODE_MODE === 'test') {
            await bookDatabase.insertBooks(searchResult);
            resolve(results);
          } else {
            bookDatabase.insertBooks(searchResult);
          }
        } else {
          /* istanbul ignore next */
          {
            console.log(error);
            reject(error);
          }
        }
      });
    });
  }

  /**
   * Search books which match with the text in the database
   * Search online if the are no results from the database
   *
   * If there are results from the database, search asynchronous the book online to refresh the data
   *
   * @param {*} text
   * @param {*} limit
   * @returns
   * @memberof BookService
   */
  async getBooks(text, limit) {
    const results = await bookDatabase.searchBooks(text, limit);
    if (results.length === 0) {
      return await this.searchOnline(text, limit);
    } else {
      // to refresh data but no need to wait
      /* istanbul ignore next */
      if (process.env.NODE_MODE === 'test') {
        await this.searchOnline(text, limit);
      } else {
        this.searchOnline(text, limit);
      }
      return results;
    }
  }

  /**
   * Get book by id
   *
   * @param {*} id The book's id
   * @returns The book match with the id
   * @memberof BookService
   */
  async getBook(id) {
    return await bookDatabase.getBook(id);
  }

  /**
   * Get a list of the best books with the higher averageNote
   *
   * @param {*} limit A limit of the list size
   * @returns A list of the best books with the higher averageNote
   * @memberof BookService
   */
  async getBestBook(limit) {
    const books = await bookDatabase.getAllBooks();
    const booksWithAverage = await Promise.all(
      books.map(async book => {
        book.averageNote = await this.getBookAverageNote(book.id);
        return book;
      })
    );
    /* istanbul ignore next */
    return booksWithAverage
      .sort((a, b) => b.averageNote - a.averageNote)
      .slice(0, limit);
  }

  /**
   * Get the book average which match with the id
   *
   * @param {*} id The book id to find the averageNote
   * @returns The book averageNote
   * @memberof BookService
   */
  async getBookAverageNote(id) {
    const bookStars = await bookStarsService.getBookStarsByBookId(id);

    if (bookStars.length === 0) {
      return 0;
    } else {
      /* istanbul ignore next */
      const noteAverage = bookStars
        .map(bookStarsFetched => bookStarsFetched.note / bookStars.length)
        .reduce((prev, current) => prev + current);

      return Math.round(noteAverage * 2) / 2;
    }
  }

  /**
   * Get the book comments which match with the id
   *
   * @param {*} id The book id to find the comments
   * @returns The book comments
   * @memberof BookService
   */
  async getBookComments(id) {
    const comments = await commentService.getCommentsByBookId(id);

    if (comments.length === 0) {
      return 0;
    } else {
      /* istanbul ignore next */
      return comments;
    }
  }
}

const bookService = new BookService();

module.exports = bookService;
