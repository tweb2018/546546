// server.js
require('dotenv').config({
  path: `${__dirname}/.env`
});

const express = require('express');
const indexRouter = require('./src/routes/index');
const auth = require('./src/routes/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {
  ApolloServer,
} = require('apollo-server-express');
const {
  typeDefs,
  resolvers
} = require('./src/graphql/schema');
const {
  db
} = require('./src/dataBase/database');
const {
  userService
} = require('./src/services/userService');
const {
  getUuidToken
} = require('./src/middleware/firebase-auth');

const app = express();

// Set up a whitelist and check against it:
var whitelist = [process.env.WHITELIST_HOST]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
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
  context: ({
    req
  }) => {
    const token = req.header('Authorization') || '';
    const uuid = getUuidToken(token);
    return {
      uuid
    };
  }
});

server.applyMiddleware({
  app,
  apiKey: process.env.ENGINE_API_KEY
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}${server.graphqlPath}`);
});

module.exports = {
  app
};