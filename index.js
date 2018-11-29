// if for automatic deployement purpose.
if (process.env.NODE_MODE !== "production") {
  /* eslint-disable global-require */
  require("dotenv").config({ path: `${__dirname}/../.env` });
  /* eslint-enable global-require */
}

// Bring in our dependencies
const app = require("express")();
// use cors for front end request compatibility
const cors = require("cors");

const port = process.env.PORT || 3000;

/* *******************************************************
 * Routes and models
 ******************************************************* */
require("./src/models/Users");
require("./src/config/passport");
const routes = require("./src/routes/routes");
const users = require("./src/routes/auth");

app.use(require("./src/routes"));

/* *******************************************************
 * Default route
 ******************************************************* */
app.get("/", routes);
app.get("/login", users);

/* ******************************************************
 * Error Handler
 ******************************************************* */
// Difficult to test
/* istanbul ignore next */
app.use((req, res, err) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

// Turn on that server!
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
