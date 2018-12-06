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
    books(title: String): [Book]
    book(id: String!): Book
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
    // args : book title (optional)
    books: (parent, args, context, info) => {
      return bookService.getBooks(args.title);
    },
    // args : book permalink
    book: (parent, args, context, info) => {
      return bookService.getBook(args.id);
    }
  }
};

module.exports = { typeDefs, resolvers };
