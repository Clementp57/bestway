var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http');

var validateToken = require('./middlewares/validateToken'),
    routes = require('./routes/index'),
    public_routes = require('./routes/public'),
    mongodb = require('./services/mongodb'),
    redis = require('./services/redis'),
    users = require('./routes/users'),
    transports = require('./routes/transports');

var User = require('./models/User');
var API_BASE_PATH = "/api/v1";

// Connecting to databases
mongodb.connect();
redis.connect(function() {});

var serverInstance = express();
serverInstance.use(cors());
// serverInstance.use(morgan('combined'));
serverInstance.use(bodyParser.json({limit: '16mb'})); // support json encoded bodies
serverInstance.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
})); // support encoded bodies

// Routing
serverInstance.all(API_BASE_PATH + '/*' , [
    require('./middlewares/validateToken')
]);

serverInstance.all('/public/*', public_routes);
serverInstance.use(API_BASE_PATH+'/users', users);
serverInstance.use(API_BASE_PATH+'/transports', transports);
serverInstance.use(API_BASE_PATH, routes);
serverInstance.use(API_BASE_PATH + '/transports', transports);

// HAProxy health check
serverInstance.get('/', function (req, res) {
  res.send('<html><body>Hello from Node.js container </body></html>');
});

// Creating Http Server
serverInstance.listen((process.env.PORT || 80), function(){
    console.info('Http server running on http://localhost:' + (process.env.PORT || 80));
});
