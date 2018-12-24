const bookStarsDatabase = require('../dataBase/bookStarsDatabase');

class BookStarsService {
  constructor() {
    this.createBookStars = this.createBookStars.bind(this);
    this.createBookStarsFromExistingBookStars = this.createBookStarsFromExistingBookStars.bind(
      this
    );
    this.insertBookStars = this.insertBookStars.bind(this);
    this.updateBookStars = this.updateBookStars.bind(this);
    this.getBookStars = this.getBookStars.bind(this);
    this.getBookStarsByBookId = this.getBookStarsByBookId.bind(this);
    this.getBookStarsByUserId = this.getBookStarsByUserId.bind(this);
    this.deleteBookStars = this.deleteBookStars.bind(this);
    this.deleteBookStarsByBookId = this.deleteBookStarsByBookId.bind(this);
    this.deleteBookStarsByUserId = this.deleteBookStarsByUserId.bind(this);
  }

  createBookStars(bookId, userId, note) {
    return {
      bookId: bookId,
      userId: userId,
      note: note
    };
  }

  createBookStarsFromExistingBookStars(bookStars) {
    return this.createBookStars(
      bookStars.bookId,
      bookStars.userId,
      bookStars.note
    );
  }

  async insertBookStars(bookStars) {
    return await bookStarsDatabase.insertBookStars(bookStars);
  }

  async updateBookStars(bookStars) {
    return await bookStarsDatabase.updateBookStars(
      this.createBookStarsFromExistingBookStars(bookStars)
    );
  }

  async getBookStars(bookId, userId) {
    return await bookStarsDatabase.getBookStars(bookId, userId);
  }

  async getBookStarsByBookId(bookId) {
    return await bookStarsDatabase.getBookStarsByBookId(bookId);
  }

  async getBookStarsByUserId(userId) {
    return await bookStarsDatabase.getBookStarsByUserId(userId);
  }

  async deleteBookStars(bookId, userId) {
    return await bookStarsDatabase.deleteBookStars(bookId, userId);
  }

  async deleteBookStarsByBookId(bookId) {
    return await bookStarsDatabase.deleteBookStarsByBookId(bookId);
  }

  async deleteBookStarsByUserId(userId) {
    return await bookStarsDatabase.deleteBookStarsByUserId(userId);
  }
}

const bookStarsService = new BookStarsService();

module.exports = bookStarsService;
