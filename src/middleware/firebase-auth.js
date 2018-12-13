const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../utils/bookbook-c5c5c-firebase-adminsdk-dt3of-4017bc972e');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://bookbook-c5c5c.firebaseio.com'
});

//Create authentication middle
isAuthenticated = (req, res, next) => {
  // check if user is logged in
  // if they are not send and unathorized response
  const authorization = req.header('Authorization');
  if (authorization) {
    firebaseAdmin
      .auth()
      .verifyIdToken(authorization)
      .then(decodeToken => {
        console.log(decodeToken);
        res.locals.user = decodeToken;
        next();
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(401);
      });
  } else {
    console.log('Authorization header is not found');
    res.sendStatus(401);
  }
};

module.exports = isAuthenticated;
