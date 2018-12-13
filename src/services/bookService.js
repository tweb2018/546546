const mongoose = require('mongoose');
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
            id: mongoose.Types.ObjectId(book.id),
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
          console.log(error);
          reject(error);
        }
      });
    });
  }

  getBooks(text, limit) {
    return bookDatabase
      .getBooks(text, limit)
      .then(results => {
        if (results.length === 0) {
          return this.searchOnline(text, limit);
        } else {
          // to refresh data but no need to wait
          this.searchOnline(text, limit);
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

  // retrive all comments
  bookComments(bookId) {
    // TODO => Patrick
  }
}

const bookService = new BookService();

module.exports = bookService;