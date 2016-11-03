var mongoose = require('mongoose');
var schedule = require('node-schedule');

var weatherForecastJob = require('./jobs/weatherForecastJob');
var RATPTrafficJob = require('./jobs/RATPTrafficJob');

var DATABASE_NAME = "bestway";
var API_BASE_PATH = "/api/v1";

// TODO: put this in a db.js file
mongoose.connect("mongodb://mongo:27017/" + DATABASE_NAME, function (error) {
  if (error) {
    console.log('Failed to connect mongod instance, please check mongodb is installed on your system and mongod instance is running on port 27017');
    console.error('Error:' + error);
  } else {
    console.log('Mongodb connection established');

    // Execute jobs on scheduler startup
    weatherForecastJob.executeJob();
    RATPTrafficJob.executeJob();
  }
});

// Jobs scheduling
// Recurrence rules
var recurrenceEveryThirtyMinutes = new schedule.RecurrenceRule();
recurrenceEveryThirtyMinutes.minute = [0, 30];
var recurrenceEveryTenMinutes = new schedule.RecurrenceRule();
recurrenceEveryTenMinutes.minute = [0, 10, 20, 30, 40, 50];
var recurrenceEveryTenSeconds = new schedule.RecurrenceRule();
recurrenceEveryTenSeconds.second = [0, 10, 20, 30, 40, 50];
var recurrenceEverySixHours = new schedule.RecurrenceRule();
recurrenceEverySixHours.hour = [0, 6, 12, 18];
recurrenceEverySixHours.minute = 0;

// Call weather forecast job every 30 minutes
var weatherForecastJobSchedule = schedule.scheduleJob(recurrenceEveryThirtyMinutes, function () {
  // debug logs
  var date = new Date();
  console.log('weatherForecastJob running @' + date);
  weatherForecastJob.executeJob();
});

// Call weather forecast job every 10 minutes
var RATPTrafficJobSchedule = schedule.scheduleJob(recurrenceEveryTenMinutes, function () {
  // debug logs
  var date = new Date();
  console.log('RATP traffic running @' + date);
  RATPTrafficJob.executeJob();
});


