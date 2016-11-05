var jwt = require('jwt-simple');
var User = require('../models/User.js');
var redis = require('../services/redis');
var secret = require('../../config/secret');

var auth = {

  login: (req, res) => {
    console.log(req.body.email + " Requested login. IP ["+ req.connection.remoteAddress + "]");
    var email = req.body.email || null;
    var password = req.body.password || null;
    if(!email) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to DB and check if the credentials are valid
    auth.validate(email, password, (user) => {
      // If authentication is success, we will generate a token
      // and dispatch it to the client
      console.log('Delivering JWT to user:' + email);
      res.status(200);
      var response = generateToken(user);
      registerToken(response.token, user._id);
      res.json(response);
    }, (error) => {
      console.log(error);
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
    });

  },

  register: (req, res) => {
    // console.log('Registering', JSON.parse(req.body));
    var user = req.body;

    if(!user.email || !user.password) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "No email provided"
      });
      return;
    };

    auth.validate(user.email, user.password, () => {

    }, () => {
      console.info('New user, registering');
      var dbUser = new User(user);
      dbUser.save((obj) => {
        console.log('Delivering JWT to user:' + dbUser);
        res.status(200);
        var response = generateToken(dbUser);
        registerToken(response.token, dbUser._id);
        res.json(response);
      });
    });

  },

  validate: (email, password, successCallback, errorCallback) => {
    if(!email) {
      return errorCallback();
    }
    User.findOne({ 'email' : email }, 'password id', (err, user) => {
      if(err || !user || (user.password != password)) {
        return errorCallback(err);
      } else {
        return successCallback(user);
      }
    });

  },

  validateUser: (email, password, successCallback, errorCallback) => {
    auth.validate(email, password, (user) => {
      return successCallback(user);
    }, (error) => {
      return errorCallback(error);
    });
  },
}

// TODO: Insert token in Redis
function registerToken(token, userId) {
  redis.getInstance().then((redisInstance) => {
    redisInstance.set(token, userId.toString());
  });
}

// private method
function generateToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, secret.getTokenSecret());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
