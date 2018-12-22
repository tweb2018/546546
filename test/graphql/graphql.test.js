if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../../src/graphql/schema');
const { createTestClient } = require('apollo-server-testing');
const bookDatabase = require('../../src/dataBase/bookDatabase');
const { book } = require('../dataBase/models');
const gql = require('graphql-tag');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;

chai.use(dirtyChai);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: undefined
});

const { query, mutate } = createTestClient(server);

const GET_BOOKS = gql`
  query Books($title: String, $limit: Int) {
    books(text: $title, limit: $limit) {
      id
      title
      authors
      summary
      published_date
      thumbnail
      comments {
        id
      }
    }
  }
`;

const GET_BOOK = gql`
  query Book($id: String!) {
    book(id: $id) {
      id
      title
      authors
      summary
      published_date
      thumbnail
      comments {
        id
      }
    }
  }
`;

describe('graphql.test.js', function() {
  this.timeout(10000);

  const limit = 5;

  before(async () => {
    await bookDatabase.connect();
  });

  beforeEach(async () => {
    await bookDatabase.clear();
  });

  after(async () => {
    await server.stop();
    await bookDatabase.close();
  });

  it('Can fetch book', async () => {
    const result = await bookDatabase.insertBook(book);

    const results = await query({
      query: GET_BOOK,
      variables: {
        id: result.id
      }
    });

    const dbBook = results.data.book;
    expect(dbBook).to.not.be.undefined();
    expect(dbBook.id).to.be.deep.equal(result.id);
    expect(dbBook.title).to.be.deep.equal(result.title);
  });

  it('Can fetch books', async () => {
    const results = await query({
      query: GET_BOOKS,
      variables: {
        title: 'Mama mia',
        limit: limit
      }
    });
    const { books } = results.data;
    expect(books).to.not.be.undefined();
    expect(books.length).to.be.deep.equal(limit);
  });
});
