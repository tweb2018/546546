const { gql } = require('apollo-server-express');
const { find, filter } = require('lodash');

const books = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling'
  },
  {
    id: 2,
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    author: String
  }

  type Author {
    name: String
    books: [Book]
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
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
  Query: {
    books: (parent, args, context, info) => books,
    book: (parent, args, context, info) => {
      return find(book, { id: args.id });
    }
  }
};

module.exports = { typeDefs, resolvers };
