process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

let user_name = 'a user';
let password = 'password';
describe('Users', () => {

  beforeEach(done => {
    User.remove({}, (err) => {
      done();
    });

    var hf = new User({
      name: user_name,
      password: password,
      admin: true
    });
    var hf2 = new User({
      name: user_name+"xx.",
      password: password+"xx.",
      admin: false
    });

    // save the sample user
    hf.save((err) => {
      if (err) throw err;
    });
    // save the sample user
    hf2.save((err) => {
      if (err) throw err;
    });
  });

  /*
  * Test the /GET route
  */
  describe('/GET /api/users', () => {
    var token;
    chai.request(server)
    .post('/api/authenticate')
    .send({
      'name': user_name,
      'password': password
    })
    .end((err, res) => {
      token = res.body.token;
    });

    it('should GET all the users', (done) => {
      chai.request(server)
      .get('/api/users')
      .query({token: token})
      .end((err, res) => {
        console.log(JSON.stringify(res, null, 4));
        res.status.should.equal(200);
        res.body.should.be.a('array');
        res.body.should.have.length(2);
        res.body[0].name.should.equal(user_name);
        res.body[0].password.should.equal(password);
        res.body[0].admin.should.be.true;
        done();
      });
    });
  });
});
