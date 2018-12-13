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
  getUuidToken
} = require('./src/middleware/firebase-auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

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
  apiKey: process.env.ENGINE_API_KEY,
  cors: {
    origin: process.env.WHITELIST_HOST
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}${server.graphqlPath}`);
});

module.exports = {
  app
};