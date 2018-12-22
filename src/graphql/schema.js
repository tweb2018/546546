const { gql } = require('apollo-server-express');
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

/* istanbul ignore next  */
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
    published_date: String
    thumbnail: URL
    comments: [Comment]
  }

  type User {
    id: ID!
    login: String
    first_name: String
    last_name: String
    email: Email
    comments: [Comment]
  }

  # TODO => Patrick
  type Comment {
    id: ID!
    bookId: String!
    userId: String!
  }

  type Query {
    books(text: String, limit: Int): [Book]
    book(id: String!): Book
    profile: User
  }

  input UserInput {
    id: ID
    login: String
    first_name: String
    last_name: String
    email: Email
  }

  type Mutation {
    insertUser(data: UserInput!): User
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
/* istanbul ignore next  */
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
      if (context.uuid === null) {
        console.log('uuid is null');
        return null;
      } else {
        console.log('Uuid from profile: ', context.uuid);
        const user = userService.getUser(context.uuid);
        console.log('User name: ', user.email);
        return user;
      }
    }
  },
  Book: {
    comments: (parent, args, context, info) => {
      return []; // TODO => Patrick
    }
  },
  User: {
    comments: (parent, args, context, info) => {
      return []; // TODO => Patrick
    }
  },

  Mutation: {
    insertUser: (_, { data }) => {
      const user = {
        id: data.id,
        login: data.login,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      };
      userService.insertUser(user);
      console.log(`User ${user.email} was inserted in dataBase`);
      return user;
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
