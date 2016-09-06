var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http');

var weatherForecastJob = require('./jobs/weatherForecastJob');

var DATABASE_NAME = "bestway";
var API_BASE_PATH = "/api/v1";

mongoose.connect("mongodb://localhost/" + DATABASE_NAME, (error) => {
  if(error) {
    console.log('Failed to connect mongod instance, please check mongodb is installed on your system and mongod instance is running on port 27017');
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

// Test Route
serverInstance.get(API_BASE_PATH, function(req, res) {
    res.status(200).json({
        msg: 'OK'
    });
});

// Creating Http Server
serverInstance.listen((process.env.PORT || 5000), function(){
    console.info('Http server running on http://localhost:' + (process.env.PORT || 5000));
});

// Test job
//weatherForecastJob.executeJob();
