var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserTransportationPreferences = require('../models/UserTransportationPreferences.js');

// Benchmark test
router.post('/', (req, res) => {
  var userId = req.headers['x-user-id'];
  UserTransportationPreferences.findOne({ 'userId': userId }, (err, userPreferences) => {
    if (err || !userPreferences) {
      var userTransportationPreferences = new UserTransportationPreferences(req.body);
      userTransportationPreferences.userId = req.headers['x-user-id'];
      userTransportationPreferences.save((error, userPrefs) => {
        if (error) {
          res.status(500).json({
            error: error
          });
        } else  {
          console.log('done saving userTransportationPreferences :', userPrefs);
          res.status(200).json({
            msg: 'done'
          });
        }
      });
    } else {
      userPreferences.bicycling = req.body.bike;
      userPreferences.bus = req.body.bus;
      userPreferences.walking = req.body.walk;
      userPreferences.subway = req.body.subway;
      userPreferences.driving = req.body.car;
      userPreferences.tram = req.body.tram;
      userPreferences.train = req.body.train;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      userPreferences.save((error, userPreferences) => {
        if (error) {
          res.status(500).json({
            error: error
          });
        } else  {
          res.json(200, userPreferences);
        }
      });
    }
  });
});

router.get('/', (req, res) => {
  var userId = req.headers['x-user-id'];
  UserTransportationPreferences.findOne({ 'userId': userId }, (err, userPreferences) => {
    if (!userPreferences) {
      res.status(418).json({
        "msg": "I am a teapot ! User preferences not found"
      });
    } else  if(err) {
       res.status(500).json({
        "msg": "Server Internal Error : " + err
      });
    } else {
      res.status(200).json({
        userPreferences: userPreferences
      });
    }
  });
});

router.put('/', (req, res) => {
  UserTransportationPreferences.findOne({ 'userId': req.body.userId }, (err, userPreferences) => {
    userPreferences.bicycling = req.body.bike;
    userPreferences.bus = req.body.bus;
    userPreferences.walking = req.body.walk;
    userPreferences.subway = req.body.subway;
    userPreferences.driving = req.body.car;
    userPreferences.tram = req.body.tram;
    userPreferences.train = req.body.train;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    userPreferences.save((err, userPrefs) => {
      res.json(200, userPrefs);
    });
  });
});

module.exports = router;
