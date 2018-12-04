// server.js
const express = require('express');
const indexRouter = require('./src/routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./src/graphql/schema');

require('dotenv').config({ path: `${__dirname}/.env` });

const app = express();

app.use(cors());
app.use('/', indexRouter);

const books = require('./src/routes/booksSearch');
app.get('/book/:title', books);

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = { app };
