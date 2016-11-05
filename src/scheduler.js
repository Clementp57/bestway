var mongoose = require('mongoose');
var schedule = require('node-schedule');
var redis = require('./services/redis');

var WeatherForecastJob = require('./jobs/WeatherForecastJob');
var RATPTrafficJob = require('./jobs/RATPTrafficJob');

redis.connect().then(() => {
  console.log("redis connected")
  redis.getInstance().then((redisInstance) => {
    console.log("Got redis instance, running jobs..");

    // Execute jobs on scheduler startup
    WeatherForecastJob.executeJob();
    RATPTrafficJob.executeJob();
  });
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
var WeatherForecastJobSchedule = schedule.scheduleJob(recurrenceEveryThirtyMinutes, () => {
  // debug logs
  var date = new Date();
  console.log('weatherForecastJob running @' + date);
  WeatherForecastJob.executeJob();
});

// Call weather forecast job every 10 minutes
var RATPTrafficJobSchedule = schedule.scheduleJob(recurrenceEveryTenMinutes, () => {
  // debug logs
  var date = new Date();
  console.log('RATP traffic running @' + date);
  RATPTrafficJob.executeJob();
});


