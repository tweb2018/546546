const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const schema = new Schema(
  {
    bookId: {
      type: String,
      index: {
        unique: true
      }
    },
    userId: {
      type: String,
      index: {
        unique: true
      }
    },
    note: Number
  },
  // used to delete _v in mongoose object
  {
    versionKey: false,
    autoIndex: false
  }
);

schema.index(
  {
    bookId: 1,
    userId: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model('bookStars', schema);
