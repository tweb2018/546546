const { gql } = require('apollo-server-express');
const { find, filter } = require('lodash');
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLLimitedString,
  GraphQLPassword,
  GraphQLUUID
} = require('graphql-custom-types');

const bookService = require('../services/bookService');
const userService = require('../services/userService');

const typeDefs = gql`
  scalar URL
  scalar Email
  scalar DateTime
  scalar LimitedString
  scalar Password
  scalar UUID

  type Book {
    id: ID!
    title: String
    authors: [String]
    summary: String
    publishedDate: String
    thumbnail: URL
  }

  type Query {
    books(text: String, limit: Int): [Book]
    book(id: String!): Book
    profile() User
  }
`;

/*
parent: an object that contains the result returned from 
      the resolver on the parent type
args: An object that contains the arguments passed to the field.
      ex: application(id: "5"
context: an object shared by all resolvers in GraphQL operation
        use for authentication
info: use this only in advanced cases.        
*/
const resolvers = {
  URL: GraphQLURL,
  Email: GraphQLEmail,
  DateTime: GraphQLDateTime,
  LimitedString: GraphQLLimitedString,
  Password: GraphQLPassword,
  UUID: GraphQLUUID,

  Query: {
    // args : book text (optional)
    books: (parent, args, context, info) => {
      return bookService.getBooks(args.text, args.limit);
    },
    // args : book id
    book: (parent, args, context, info) => {
      return bookService.getBook(args.id);
    },

    profile: (parent, args, context, info) => {
      if (!context.uuid) {
        //User === null donc non authentifié
        return null;
      } else {
        return userService.getUser(context.uuid);
      }
    }
  }
};

module.exports = { typeDefs, resolvers };
