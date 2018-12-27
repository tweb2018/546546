// server.js
// if for automatic deployement purpose.
if (process.env.NODE_MODE !== 'production') {
  require('dotenv').config({
    path: `${__dirname}/.env`
  });
}

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./src/graphql/schema');
const { db } = require('./src/dataBase/database');
const { getUuidToken } = require('./src/middleware/firebase-auth');
const route = require('./src/routes/route');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

/* istanbul ignore if  */
if (process.env.NODE_MODE !== 'test') {
  db.connect();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const uuid = await getUuidToken(token).catch(() => {
        return null;
      });

      return { uuid };
    }
  });

  server.applyMiddleware({
    app,
    path: route.graphql
  });

  /* istanbul ignore if  */
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

module.exports = {
  app,
  db,
  port
};
