import express from 'express';
import User from '../models/user';

let router = express.Router();
/* GET setup */
router.get('/', (req, res, next) => {
  // create a sample user
  var hf = new User({
    name: 'hongfei li',
    email: 'fever324@gmail.com',
    password: 'password',
    admin: true
  });

  // save the sample user
  hf.save((err) => {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

module.exports = router;
