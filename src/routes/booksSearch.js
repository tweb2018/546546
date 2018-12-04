// routes/books.js

const router = require('express').Router();
const books = require('google-books-search');

const { db } = require('../dataBase/database');

getPermalink = title => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

router.get('/book/:title', (req, res) => {
  const titleSearch = req.params.title;

  db.getBooks(titleSearch).then(booksSearch => {
    // If not found on database, search online
    if (booksSearch.length === 0) {
      books.search(titleSearch, (error, results) => {
        if (!error) {
          const searchResult = results.map(book => ({
            id: book.industryIdentifiers[0].identifier,
            cache_timestamp: new Date(),
            authors: book.authors,
            title: book.title,
            permalink: getPermalink(book.title),
            summary: book.description || '',
            publishedDate: book.publishedDate
          }));
          res.send(searchResult);
          db.insertBooks(searchResult);
        } else {
          res.send(error);
        }
      });
    } else {
      res.send(booksSearch);
    }
  });
});

module.exports = router;
