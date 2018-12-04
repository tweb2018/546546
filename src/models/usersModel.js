const mongoose = require('mongoose');

/* eslint-disable prefer-destructuring */
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: Number,
    creation_date: String,
    login: String,
    name: String,
    location: String,
    avatar: String,
    firebaseUid: String
  },
  // used to delete the _id and _v in mongoose object
  {
    toObject: {
      virtuals: false // don't seems to work at all
    },
    toJSON: {
      virtuals: false // don't seems to work at all
    }
  }
);

module.exports = mongoose.model('user', schema);
