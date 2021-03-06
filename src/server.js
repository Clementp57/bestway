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
    userPreferences = require('./routes/userPreferences'),
    transports = require('./routes/transports'),
    winston = require('winston');


var User = require('./models/User');
var API_BASE_PATH = "/api/v1";

// Connecting to databases
mongodb.connect();
redis.connect();

var serverInstance = express();

serverInstance.use(cors());

serverInstance.use(bodyParser.json({limit: '16mb'})); // support json encoded bodies
serverInstance.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
})); // support encoded bodies

// Routing
serverInstance.all(API_BASE_PATH + '/*' , [
    //require('./middlewares/validateToken')
]);

serverInstance.all('/public/*', public_routes);
serverInstance.use(API_BASE_PATH+'/users', users);
serverInstance.use(API_BASE_PATH+'/userPreferences', userPreferences);
serverInstance.use(API_BASE_PATH+'/transports', transports);
serverInstance.use(API_BASE_PATH, routes);

// HAProxy health check
serverInstance.get('/', (req, res) => {
  res.send('<html><body>Hello from Node.js container </body></html>');
});

// Creating Http Server
serverInstance.listen((process.env.PORT || 80), () => {
    console.info('HTTP Server Instance up & running');
});
