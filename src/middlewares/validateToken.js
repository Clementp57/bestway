var jwt = require('jwt-simple');
var redis = require('../services/redis');
var secret = require('../../config/secret.js')

module.exports = (req, res, next) => {
  console.log("HEADERs => ", req.headers);
  var token = req.headers['x-access-token'] || null;
  var userId = req.headers['x-user-id'] || null;
  if (token && userId) {
    try {
      console.log('trying to decode token');
      var decoded = jwt.decode(token, secret.getTokenSecret());
      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      } else {
        var associatedUserId = redis.getInstance().then((redisInstance) => {
          redisInstance.get(token,
            (err, reply) => {
              if(err) {
                console.error('Failed getting token from redis :' + error);
                res.status(500);
                res.json({
                  "status": 500,
                  "message": "Oops something went wrong",
                  "error": error
                });
              } else if(reply == userId) {
                return next();
              }
         });
        });
      }

    } catch(error) {
      console.error('Failed checking token :' + error);
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": error
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }
};
