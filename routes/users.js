var express = require('express');
var router = express.Router();
var User = require('../models/user')
var verification = require('../util/verification')


router.get('/:userId', function(req, res) {
  res.send(req.params.userId);
});

router.use(function(req, res,next){
  verification.verifyRequest(req, res, next);
});

// route to return all users (GET /api/users)
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = router;
