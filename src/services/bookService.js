const googleBooks = require('google-books-search');

const bookDatabase = require('../dataBase/bookDatabase');

class BookService {
  constructor() {
    this.getBook = this.getBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
    this.searchOnline = this.searchOnline.bind(this);
  }

  searchOnline(title) {
    return new Promise((resolve, reject) => {
      googleBooks.search(title, (error, results) => {
        if (error === null) {
          const searchResult = results.map(book => ({
            id: book.id,
            cache_timestamp: new Date(),
            authors: book.authors,
            title: book.title,
            summary: book.description || '',
            publishedDate: book.publishedDate,
            thumbnail: book.thumbnail
          }));

          bookDatabase.insertBooks(searchResult);

          resolve(results);
        } else {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  getBooks(title) {
    return bookDatabase
      .getBooks(title)
      .then(results => {
        if (results.length === 0) {
          return this.searchOnline(title);
        } else {
          // to refresh data but no need to wait
          this.searchOnline(title);
          return results;
        }
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  getBook(id) {
    return bookDatabase
      .getBook(id)
      .then(result => {
        return result;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }
}

const bookService = new BookService({});

module.exports = bookService;
