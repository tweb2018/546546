const googleBooks = require('google-books-search');
const bookDatabase = require('../dataBase/bookDatabase');
const bookStarsService = require('../services/bookStarsSevice');

class BookService {
  constructor() {
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.searchOnline = this.searchOnline.bind(this);
    this.createBook = this.createBook.bind(this);
    this.getBestBook = this.getBestBook.bind(this);
    this.getBookAverageNote = this.getBookAverageNote.bind(this);
  }

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

  searchOnline(text, limit = 10) {
    const options = {
      limit: limit
    };

    return new Promise((resolve, reject) => {
      googleBooks.search(text, options, async (error, results) => {
        if (error === null) {
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
          } else {
            bookDatabase.insertBooks(searchResult);
          }

          resolve(results);
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

  async getBook(id) {
    return await bookDatabase.getBook(id);
  }

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

  // retrive all comments
  async bookComments(bookId) {
    // TODO => Patrick
  }
}

const bookService = new BookService();

module.exports = bookService;
