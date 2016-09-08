var validateUser = require('../routes/auth').validateUser;
var validateToken = require('./validateToken');

module.exports = function(req, res, next) {
  if(req.headers['x-admin'] && req.headers['x-admin'] == 'true') {
    console.log('ADMIN AUTHORIZED');
    return next();
  }

  // validateToken(function(ok) {
  //   if(ok) {
  //     return next();
  //   } else {
  //     res.status(403);
  //     res.json({
  //       "status": 403,
  //       "message": "Not Authorized"
  //     });
  //     return;
  //   }
  // });
  return next();

  // validateUser(email, function(user) {
  //   if (user) {
  //     console.log('Authorized '+user);
  //     return next(); // To move to next middleware
  //   } else {
  //     res.status(403);
  //     res.json({
  //       "status": 403,
  //       "message": "Not Authorized"
  //     });
  //     return;
  //   }
  // }, function(error){
  //   // No user with this name exists, respond back with a 401
  //   res.status(401);
  //   res.json({
  //     "status": 401,
  //     "message": "Invalid User"
  //   });
  //   return;
  // });
};
