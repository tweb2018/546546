const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.plugin(require('mongoose-regex-search'));

const schema = new Schema({
  cache_timestamp: Date,
  authors: {
    type: [String],
    searchable: true
  },
  title: {
    type: String,
    searchable: true
  },
  permalink: String,
  summary: {
    type: String,
    searchable: true
  },
  publishedDate: Date
});

module.exports = mongoose.model('book', schema);
