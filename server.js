// server.js
require('dotenv').config({
  path: `${__dirname}/.env`
});

const express = require('express');
const indexRouter = require('./src/routes/index');
const auth = require('./src/routes/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./src/graphql/schema');
const { db } = require('./src/dataBase/database');
const { getUuidToken } = require('./src/middleware/firebase-auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', indexRouter);
app.use('/api', auth);

/* istanbul ignore if  */
if (process.env.NODE_MODE !== 'test') {
  db.connect();
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.header('Authorization') || '';
    const uuid = getUuidToken(token);
    return {
      uuid
    };
  }
});

server.applyMiddleware({
  app
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}${server.graphqlPath}`);
});

module.exports = {
  app
};
