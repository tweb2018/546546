const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const schema = new Schema(
  {
    id: {
      type: String,
      searchable: false,
      index: {
        unique: true
      }
    },
    cache_timestamp: Date,
    authors: {
      type: [String],
      searchable: true
    },
    title: {
      type: String,
      searchable: true
    },
    summary: {
      type: String,
      searchable: true
    },
    published_date: Date,
    thumbnail: {
      type: String,
      searchable: false
    }
  },
  // used to delete _v in mongoose object
  {
    versionKey: false
  }
);

module.exports = mongoose.model('book', schema);
