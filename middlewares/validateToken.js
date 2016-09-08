var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'] || null;
  if (token) {
    try {
      console.log('trying to decode token');
      var decoded = jwt.decode(token, require('../config/secret.js')());
      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }
      return next();
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
