// server.js
const express = require('express');
const indexRouter = require('./src/routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const DataBase = require('./src/dataBase/database');
const { typeDefs, resolvers } = require('./src/graphql/schema');

const db = new DataBase({});

require('dotenv').config();

const app = express();

app.use(cors());
app.use('/', indexRouter);

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = app;
