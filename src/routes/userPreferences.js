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
        console.log('done saving userTransportationPreferences :', userPrefs);
        res.status(200).json({
          msg: 'done'
        });
      });
    } else {
      userPrefs.bike = req.body.bike;
      userPrefs.bus = req.body.bus;
      userPrefs.walk = req.body.walk;
      userPrefs.subway = req.body.subway;
      userPrefs.car = req.body.car;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      userPrefs.save((err, userPrefs) => {
        res.json(200, userPrefs);
      });
    }
  });

});

router.get('/', (req, res) => {
  var userId = req.headers['x-user-id'];
  UserTransportationPreferences.findOne({ 'userId': userId }, (err, userPreferences) => {
    if (err || !userPreferences) {
      res.status(418).json({
        "msg": "I am a teapot ! User preferences not found"
      });
    } else {
      res.status(200).json({
        userPreferences: userPreferences
      });
    }
  });
});

router.put('/', (req, res) => {
  UserTransportationPreferences.findOne({ 'userId': req.body.userId }, (err, userPrefs) => {
    userPrefs.bike = req.body.bike;
    userPrefs.bus = req.body.bus;
    userPrefs.walk = req.body.walk;
    userPrefs.subway = req.body.subway;
    userPrefs.car = req.body.car;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    userPrefs.save((err, userPrefs) => {
      res.json(200, userPrefs);
    });
  });
});

module.exports = router;
