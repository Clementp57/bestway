var jwt = require('jwt-simple');
var User = require('../models/User.js');
var redis = require('../services/redis');

var auth = {

  login: function(req, res) {
    console.log(req.body.email + " Requested login. IP ["+ req.connection.remoteAddress + "]");
    var email = req.body.email || null;
    if(!email) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to DB and check if the credentials are valid
    auth.validate(email, password, function(user) {
      // If authentication is success, we will generate a token
      // and dispatch it to the client
      console.log('Delivering JWT to user:' + email);
      res.status(200);
      var response = generateToken(dbUser);
      registerToken(response.token, user.id);
      res.json(response);
    }, function(error) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
    });

  },

  register: function(req, res) {
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

    auth.validate(user.email, user.password, function() {

    }, function(){
      console.info('New user, registering');

      var dbUser = new User(user);
      dbUser.save(function(obj) {
        console.log('Delivering JWT to user:' + dbUser);
        res.status(200);
        var response = generateToken(dbUser);
        registerToken(response.token, dbUser._id);
        res.json(response);
      });
    });

  },

  validate: function(email, password, successCallback, errorCallback) {
    if(!email) {
      return errorCallback();
    }
    User.findOne({ 'email' : email }, 'password id', function (err, user) {
      if(err || !user || (user.password != password)) {
        return errorCallback(err);
      } else {
        return successCallback(user);
      }
    });

  },

  validateUser: function(email, password, successCallback, errorCallback) {
    auth.validate(email, password, function(user) {
      return successCallback(user);
    }, function(error) {
      return errorCallback(error);
    });
  },
}

// TODO: Insert token in Memcache
function registerToken(token, userId) {
  redis.getInstance().set(token, userId);
}

// private method
function generateToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

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
