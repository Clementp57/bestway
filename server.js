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

// Request API route
// url sample : /api/v1/sortedTransportsLists?dep=48.856614,2.352222&arr=48.856614,2.352222&transp=1,3,4
serverInstance.get(API_BASE_PATH + '/sortedTransportsLists', function(req, res){
  var departureLocation = {latitude : req.query.dep.split(",")[0], longitude : req.query.dep.split(",")[1]};
  var arrivalLocation = {latitude : req.query.arr.split(",")[0], longitude : req.query.arr.split(",")[1]};
  var transportationsArray = req.query.transp.split(",");
  // transportations id :
  // 0 : marche
  // 1 : vélo
  // 2 : voiture
  // 3 : transports en commun
  // 4 : bus


  // TODO : requêter temps de chaque trajet & traffic autour du trajet voiture/bus + créer algorithme de sorting des listes

  res.status(200).json({
    access: 'ok'
  });



});

// Creating Http Server
serverInstance.listen((process.env.PORT || 80), function(){
    console.info('Http server running on http://localhost:' + (process.env.PORT || 80));
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
