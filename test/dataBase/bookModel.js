const mongoose = require('mongoose');

const book = {
  id: mongoose.Types.ObjectId('book_id_1234'),
  cache_timestamp: new Date(),
  authors: ['book_authors'],
  title: 'book_title',
  summary: 'book_description',
  published_date: new Date(),
  thumbnail: 'book_thumbnail',
  comments: []
};

module.exports = book;
