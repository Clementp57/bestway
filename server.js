var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http');

var validateRequest = ('./middlewares/validateRequest'),
    validateToken = ('./middlewares/validateToken'),
    routes = require('./routes/index'),
    public_routes = require('./routes/public'),
    mongodb = require('./services/mongodb'),
    memcached = require('./services/memcached');

var User = require('./models/User');
var API_BASE_PATH = "/api/v1";

// Connecting to databases
mongodb.connect();
memcached.connect();

// test
memcached.getInstance().set('foo', 'bar', 10, function (err) {
  if(err) console.log(err)
  else {
    memcached.getInstance().get('foo', function(err, data) {
      if(err) console.log(err)
      else {
        console.log('GOT FOO => ', data);
      }
    });
  }

});


var serverInstance = express();
serverInstance.use(cors());
serverInstance.use(morgan('combined'));
serverInstance.use(bodyParser.json({limit: '16mb'})); // support json encoded bodies
serverInstance.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
})); // support encoded bodies

// Routing
serverInstance.all('/public/*', public_routes);
serverInstance.use(API_BASE_PATH, routes);
serverInstance.all(API_BASE_PATH + '/*' , [
    require('./middlewares/validateToken'),
    require('./middlewares/validateRequest')
]);

// HAProxy health check
serverInstance.get('/', function (req, res) {
  res.send('<html><body>Hello from Node.js container </body></html>');
});

// Creating Http Server
serverInstance.listen((process.env.PORT || 80), function(){
    console.info('Http server running on http://localhost:' + (process.env.PORT || 80));
});

// Benchmark test
serverInstance.post(API_BASE_PATH + '/users', function(req, res) {
    console.log("request body:", req.body);
    var user = new User(req.body);
    user.save(function(error, user) {
      console.log('done saving user :', user);
      res.status(200).json({
        msg: 'done'
      });
    });
});
