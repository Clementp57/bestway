var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserTransportationPreferences = require('../models/UserTransportationPreferences.js');

// Benchmark test
router.post('/' , function(req, res) {
    console.log("request body:", req.body);
    var userTransportationPreferences = new UserTransportationPreferences(req.body);
    userTransportationPreferences.save(function(error, userPrefs) {
      console.log('done saving userTransportationPreferences :', userPrefs);
      res.status(200).json({
        msg: 'done'
      });
    });
});

router.put('/', function(req, res) {
  UserTransportationPreferences.findOne({ 'userId', req.body.userId },function(err, userPrefs) {
      userPrefs.bike = req.body.bike;
      userPrefs.bus = req.body.bus;
      userPrefs.walk = req.body.walk;
      userPrefs.subway = req.body.subway;
      userPrefs.car = req.body.car;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      userPrefs.save(function(err, userPrefs) {
          res.json(200, userPrefs);
      });
  });
});

module.exports = router;
