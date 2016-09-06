var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http'),
    schedule = require('node-schedule');

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

// Scheduling Jobs

// Set recurrence rules
var recurrenceEveryTenMinutes = new schedule.RecurrenceRule();
recurrenceEveryTenMinutes.minute = [0, 10, 20, 30, 40, 50];
var recurrenceEverySixHours = new schedule.RecurrenceRule();
recurrenceEveryTenMinutes.hour = [0, 6, 12, 18];
recurrenceEveryTenMinutes.minute = 0;

// Call weather forecast job every 6 hours
var weatherForecastJobSchedule = schedule.scheduleJob(recurrenceEverySixHours, function(){
    // debug logs
    // var date = new Date();
    // console.log('weatherForecastJob running @' + date);
    weatherForecastJob.executeJob();
});
