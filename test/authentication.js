process.env.NODE_ENV = 'test';

var User = require('../models/user')
let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let user_name = 'a user'
let password = 'password'
describe('Authenticaion', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });

    var hf = new User({
      name: user_name,
      password: password,
      admin: true
    });

    // save the sample user
    hf.save((err) => {
      if (err) throw err;
    });
  });
  /*
  * Test the /GET route
  */
  describe('/POST authenticate', () => {
    it('should fail to authenticate because user not found', (done) => {
      chai.request(server)
      .post('/api/authenticate')
      .send({
        'name': 'a wrong name',
        'password': 'a wrong password'
      })
      .end((err, res) => {
        res.body.success.should.equal(false);
        res.body.message.should.equal('Authentication failed. User not found.')
        done();
      });
    });
    it('should fail to authenticate because wrong password', (done) => {
      chai.request(server)
      .post('/api/authenticate')
      .send({
        'name': user_name,
        'password': 'a wrong password'
      })
      .end((err, res) => {
        res.body.success.should.equal(false);
        res.body.message.should.equal('Authentication failed. Wrong password.');
        done();
      });
    });
    it('should success to authenticate', (done) => {
      chai.request(server)
      .post('/api/authenticate')
      .send({
        'name': user_name,
        'password': password
      })
      .end((err, res) => {
        res.body.success.should.equal(true);
        res.body.message.should.equal('Enjoy your token!');
        expect(res.body.token).to.not.be.null;
        done();
      });
    });
  });
});
