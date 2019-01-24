const mongoose = require('mongoose');

/* eslint-disable prefer-destructuring */
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: {
      type: String,
      index: {
        unique: true
      }
    },
    login: String,
    first_name: String,
    last_name: String,
    email: String,
    avatar: String
  },
  // used to delete _v in mongoose object
  {
    versionKey: false
  }
);

module.exports = mongoose.model('user', schema);
