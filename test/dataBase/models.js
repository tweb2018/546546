const book = {
  id: 'book_id_1234',
  cache_timestamp: new Date(),
  authors: ['book_authors'],
  title: 'book_title',
  summary: 'book_description',
  published_date: new Date(),
  thumbnail: 'book_thumbnail',
  comments: []
};

const user = {
  id: 'user_id_1234',
  login: 'user_login',
  first_name: 'user_first_name',
  last_name: 'user_last_name',
  email: 'user_email',
  avatar: 'user_avatar',
  comments: []
};

const comment = {
  bookId: book.id,
  userId: user.id
};

const bookStars = {
  bookId: book.id,
  userId: user.id
};

module.exports = {
  book,
  user,
  comment,
  bookStars
};
