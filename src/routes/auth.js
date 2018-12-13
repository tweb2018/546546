// routes/auth.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/firebase-auth');

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

router.post('/login', (req, res) => {
  res.json({
    token: req.body.token
  });
});

//if user are authenticated they can acces profile info
router.get('/profile', isAuthenticated, (req, res, next) => {
  //

  res.json({
    message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${
      res.locals.user.uid
    }`
  });
});

module.exports = router;
