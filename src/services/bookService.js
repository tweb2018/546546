const googleBooks = require('google-books-search');
const bookDatabase = require('../dataBase/bookDatabase');

class BookService {
  constructor() {
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.searchOnline = this.searchOnline.bind(this);
  }

  searchOnline(text, limit) {
    const limitValue = limit === undefined ? 10 : limit;
    const options = {
      limit: limitValue
    };

    return new Promise((resolve, reject) => {
      googleBooks.search(text, options, (error, results) => {
        if (error === null) {
          const searchResult = results.map(book => ({
            id: book.id,
            cache_timestamp: new Date(),
            authors: book.authors,
            title: book.title,
            summary: book.description || '',
            published_date: book.publishedDate,
            thumbnail: book.thumbnail
          }));

          bookDatabase.insertBooks(searchResult);

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
      this.searchOnline(text, limit);
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
