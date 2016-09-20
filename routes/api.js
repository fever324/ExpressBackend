import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {verifyRequest} from '../util/verification';

let router = express.Router();
router.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, process.env.secret, {
          expiresIn: '1d'  // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

// All routes after this line requires token
router.use(function(req, res,next){
  verifyRequest(req, res, next);
});

// route to show a random message (GET /api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

module.exports = router;
