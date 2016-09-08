var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http');

var User = require('./models/User');

var DATABASE_NAME = "bestway";
var API_BASE_PATH = "/api/v1";

mongoose.connect("mongodb://mongo:27017/" + DATABASE_NAME, function(error) {
  if(error) {
    console.log('Failed to connect mongod instance, please check mongodb is installed on your system and mongod instance is running on port 27017');
    console.error('Error:' + error);
  } else {
    console.log('Mongodb connection established');
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

// HTTP check
serverInstance.get('/', function (req, res) {
  res.send('<html><body>Hello from Node.js container </body></html>');
});

// Test Route
serverInstance.get(API_BASE_PATH, function(req, res) {
    res.status(200).json({
        msg: 'OK'
    });
});

// Creating Http Server
serverInstance.listen((process.env.PORT || 80), function(){
    // console.info('Http server running on http://localhost:' + (process.env.PORT || 80));
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
