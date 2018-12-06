// server.js
const express = require('express');
const indexRouter = require('./src/routes/index');
const auth = require('./src/routes/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./src/graphql/schema');
const DataBase = require('./src/dataBase/database');

require('dotenv').config({ path: `${__dirname}/.env` });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', indexRouter);
app.use('/api', auth);

const books = require('./src/routes/booksSearch');
app.get('/book/:title', books);

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = { app };
