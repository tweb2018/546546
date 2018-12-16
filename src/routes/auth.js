// routes/auth.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/firebase-auth');
const route = require('./route');

checkIfTest = res => {
  if (process.env.NODE_MODE === 'test') {
    res.json({});
    return true;
  }
  return false;
};

// Perform the login, after login Auth0 will redirect to callback
router.post(route.register, (req, res) => {
  if (!checkIfTest(res)) {
    const { email, username, password, firstName, lastName, token } = req.body;

    //TODO Save in DB
    res.json({
      email,
      firstName,
      lastName,
      username,
      password: '*'.repeat(password.length),
      token
    });
  }
});

router.post(route.login, (req, res) => {
  if (!checkIfTest(res)) {
    res.json({
      token: req.body.token
    });
  }
});

//if user are authenticated they can acces profile info
router.get(route.profile, isAuthenticated, (req, res, next) => {
  res.json({
    message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${
      res.locals.user.uid
    }`
  });
});

module.exports = router;
