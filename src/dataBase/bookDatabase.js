const Book = require('../models/books');
const tools = require('../utils/tools');
const { DataBase } = require('./database');

const CACHE_TIME = parseInt(process.env.CACHE_TIME);

/**
 * Book database features
 *
 * @class BookDatabase
 * @extends {DataBase}
 */
class BookDatabase extends DataBase {
  constructor() {
    super();
    this.insertBook = this.insertBook.bind(this);
    this.insertBooks = this.insertBooks.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.getBook = this.getBook.bind(this);
    this.searchBooks = this.searchBooks.bind(this);
    this.getAllBooks = this.getAllBooks.bind(this);
  }

  /**
   * Insert a book in the database
   *
   * @param {*} book The book to insert
   * @returns The book which was inserted
   * @memberof BookDatabase
   */
  async insertBook(book) {
    // Custom save or update
    const findBook = await Book.findOne({
      id: book.id
    });

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
      return await this.saveInDB(dbBook);
    } else if (tools.delay(findBook.cache_timestamp) > CACHE_TIME) {
      findBook.cache_timestamp = new Date();
      return await this.updateBook(findBook);
    } else {
      return findBook;
    }
  }

  /**
   * Search a book which match with the text in the database
   * The text is compared to authors, title and summary book fields
   *
   * @param {string} [text=''] The text to search
   * @param {number} [limit=5] The limit of the result
   * @returns A list of books which match with text
   * @memberof BookDatabase
   */
  async searchBooks(text = '', limit = 5) {
    return await Book.search(text).limit(limit);
  }

  /**
   * Fetch all books of the database
   *
   * @returns All books of the database
   * @memberof BookDatabase
   */
  async getAllBooks() {
    return await Book.find({});
  }

  /**
   * Fetch the book coresponding whith the id
   *
   * @param {*} id The book id to fetch
   * @returns The book coresponding whith the id
   * @memberof BookDatabase
   */
  async getBook(id) {
    const result = await Book.findOne({
      id: id
    });
    return result;
  }

  /**
   * Insert a list of books in the database
   *
   * @param {*} books The list of books to insert
   * @returns The list of books inserted
   * @memberof BookDatabase
   */
  /* istanbul ignore next */
  async insertBooks(books) {
    return await Promise.all(
      books.map(async book => await this.insertBook(book))
    );
  }

  /**
   * Update a book
   *
   * @param {*} book The book to update
   * @returns The updated book
   * @memberof BookDatabase
   */
  async updateBook(book) {
    const result = await Book.findOneAndUpdate(
      {
        id: book.id
      },
      book,
      {
        runValidators: true,
        new: true
      }
    );
    return result;
  }
}

const bookDatabase = new BookDatabase({});

module.exports = bookDatabase;
