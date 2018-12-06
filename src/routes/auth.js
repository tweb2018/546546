// routes/auth.js

var express = require('express');
var router = express.Router();
var passport = require('passport');

// Perform the login, after login Auth0 will redirect to callback
router.post('/register', (req, res) => {
  const { email, username, password, firstName, lastName, token } = req.body;
  res.json({
    email,
    firstName,
    lastName,
    username,
    password: '*'.repeat(password.length),
    token
  });
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function(req, res, next) {
  passport.authenticate('auth0', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
