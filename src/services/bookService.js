const googleBooks = require('google-books-search');
const bookDatabase = require('../dataBase/bookDatabase');

class BookService {
  constructor() {
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.searchOnline = this.searchOnline.bind(this);
    this.createBook = this.createBook.bind(this);
  }

  createBook(id, authors, title, summary, published_date, thumbnail) {
    return {
      id: id,
      cache_timestamp: new Date(),
      authors: authors,
      title: title,
      summary: summary || '',
      published_date: published_date,
      thumbnail: thumbnail
    };
  }

  searchOnline(text, limit) {
    const limitValue = limit === undefined ? 10 : limit;
    const options = {
      limit: limitValue
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
    const results = await bookDatabase.getBooks(text, limit);
    if (results.length === 0) {
      return await this.searchOnline(text, limit);
    } else {
      // to refresh data but no need to wait
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

  // retrive all comments
  bookComments(bookId) {
    // TODO => Patrick
  }
}

const bookService = new BookService();

module.exports = bookService;
