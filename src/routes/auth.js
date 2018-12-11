// routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const serviceAccount = require('../utils/bookbook-c5c5c-firebase-adminsdk-dt3of-4017bc972e');

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bookbook-c5c5c.firebaseio.com'
});

//Create authentication middle
isAuthenticated = (req, res, next) => {
  // check if user is logged in
  // if they are not send and unathorized response
  return true;
};

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
  console.log(req);
  res.json({
    token: req.body
  });
});

//if user are authenticated they can acces profile info
router.get('/me', isAuthenticated, (req, res, next) => {
  //
  res.send('Hello from the other side');
});

module.exports = router;
