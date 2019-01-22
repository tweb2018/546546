const { gql } = require('apollo-server-express');
const firebaseAdmin = require('firebase-admin');

const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLLimitedString,
  GraphQLPassword,
  GraphQLUUID
} = require('graphql-custom-types');

const bookService = require('../services/bookService');
const bookStarsService = require('../services/bookStarsSevice');
const userService = require('../services/userService');
const commentService = require('../services/commentService');

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
    published_date: DateTime
    thumbnail: URL
    comments: [Comment]
    averageNote: Float
  }

  type BookStars {
    bookId: ID!
    userId: ID!
    note: Float
  }

  type User {
    id: ID!
    login: String
    first_name: String
    last_name: String
    email: Email
    comments: [Comment]
    bookStars: [BookStars]
  }

  type Comment {
    id: ID!
    bookId: String
    userId: String
    text: String
  }

  type Query {
    books(text: String, limit: Int): [Book]
    book(id: String!): Book
    bestBooks(limit: Int): [Book]
    profile: User
    bookStars(bookId: ID!, userId: ID!): BookStars
  }

  input CommentInput {
    id: ID!
    bookId: String!
    userId: String!
    text: String!
  }

  input UserInput {
    id: ID
    login: String
    first_name: String
    last_name: String
    email: Email
  }

  input PasswordInput {
    id: ID
    password: String
  }

  input BookStarsInput {
    bookId: ID!
    userId: ID!
    note: Float!
  }

  type Mutation {
    insertUser(data: UserInput!): User
    insertComment(data: CommentInput!): Comment
    editUser(data: UserInput!): User
    editPassword(data: PasswordInput!): Boolean
    updateBookStars(data: BookStarsInput!): BookStars
    deleteBookStars(bookId: ID!, userId: ID!): Boolean
    deleteBookStarsByBookId(bookId: ID!): Boolean
    deleteBookStarsByUserId(userId: ID!): Boolean
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
    books: async (parent, args, context, info) => {
      return await bookService.getBooks(args.text, args.limit);
    },
    book: async (parent, args, context, info) => {
      return await bookService.getBook(args.id);
    },
    bestBooks: async (parent, args, context, info) => {
      return await bookService.getBestBook(args.limit);
    },
    bookStars: async (parent, args, context, info) => {
      return await bookStarsService.getBookStars(args.bookId, args.userId);
    },
    profile: async (parent, args, context, info) => {
      if (context.uuid === null) {
        console.log('uuid is null');
        return null;
      } else {
        console.log('Uuid from profile: ', context.uuid);
        const user = await userService.getUser(context.uuid);
        return user;
      }
    }
  },
  Book: {
    comments: async (parent, args, context, info) => {
      console.log('Book::comments => ', parent.id);
      console.log(
        'Book::comments2 =>',
        await bookService.getBookComments(parent.id)
      );
      return await bookService.getBookComments(parent.id);
    },
    averageNote: async (parent, args, context, info) => {
      return await bookService.getBookAverageNote(parent.id);
    }
  },
  User: {
    comments: async (parent, args, context, info) => {
      return await userService.userComments(parent.id);
    },
    bookStars: async (parent, args, context, info) => {
      return await bookService.getBookStarsByUserId(parent.id);
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
      console.log(`User ${user.email} was INSTERTED in db`);
      return user;
    },
    insertComment: (_, { data }) => {
      const comment = {
        bookId: data.bookId,
        userId: data.userId,
        text: data.text
      };
      commentService.insertComment(comment);
      console.log(`Comment ${comment.text} was INSTERTED in db`);
      return comment;
    },
    /* Not the best way to handle user profile change
    TODO if(time){ changeThisMethod();}*/
    editUser: (_, { data }) => {
      const user = {
        id: data.id,
        login: data.login,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      };
      userService.updateUser(user);
      //change email in firebase
      firebaseAdmin.auth().updateUser(data.id, {
        email: data.email
      });

      console.log(`User ${user.email} was EDITED in db`);
      return user;
    },
    editPassword: (_, { data }) => {
      //if password is not null we set it.
      console.log('data: ', data);

      if (data.password !== null) {
        return firebaseAdmin
          .auth()
          .updateUser(data.id, {
            password: data.password
          })
          .then(() => {
            return true;
          })
          .catch(error => {
            console.log(error);
            return false;
          });
      } else {
        return false;
      }
    },
    updateBookStars: async (_, { data }) => {
      return await bookStarsService.updateBookStars(data);
    },
    deleteBookStars: async (_, { bookId, userId }) => {
      return await bookStarsService.deleteBookStars(bookId, userId);
    },
    deleteBookStarsByBookId: async (_, { bookId }) => {
      return await bookStarsService.deleteBookStarsByBookId(bookId);
    },
    deleteBookStarsByUserId: async (_, { userId }) => {
      return await bookStarsService.deleteBookStarsByUserId(userId);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
