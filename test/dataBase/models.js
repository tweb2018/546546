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

const user = {
  id: mongoose.Types.ObjectId('user_id_1234'),
  login: 'user_login',
  first_name: 'user_first_name',
  last_name: 'user_last_name',
  email: 'user_email',
  avatar: 'user_avatar',
  comments: []
};

const comment = {
  id: mongoose.Types.ObjectId('comment_id_1')
};

module.exports = {
  book,
  user,
  comment
};
