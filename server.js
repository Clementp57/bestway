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
// serverInstance.use(morgan('combined'));
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
// url sample : /api/v1/sortedTransportsLists?dep=48.856614,2.352222&arr=48.856614,2.352222&transp=1,3,4&timestamp=1473340371&transit_mode=subway&departure_time=1473340371
// transit_mode [bus, subway, train, tram, rail]
// alternatives set to true if transit issues (travaux)

serverInstance.get(API_BASE_PATH + '/sortedTransportsLists', function(req, res){
  var departureLocation = {latitude : req.query.dep.split(",")[0], longitude : req.query.dep.split(",")[1]};
  var arrivalLocation = {latitude : req.query.arr.split(",")[0], longitude : req.query.arr.split(",")[1]};
  var transportationsArray = req.query.transp.split(",");
  // transportations id : cf transport variable (lower in code)


  // TODO : requêter temps de chaque trajet & traffic autour du trajet voiture/bus + créer algorithme de sorting des listes


// travel modes :
  // transit
  // walking
  // driving
  // bicycling
  var transportationTypesArray = [
    {id: 0, type: "walking"},// marche
    {id: 1, type: "bicycling"},//vélo
    {id: 2, type: "driving"},//voiture
    {id: 3, type: "transit", subtype: "bus"},//bus
    {id: 4, type: "transit", subtype: "subway"},
    {id: 5, type: "transit", subtype: "train"},
    {id: 6, type: "transit", subtype: "tram"},
    {id: 7, type: "transit", subtype: "rail"}

  ]
  transportationsArray.forEach(function(transportId, index, transportationsArray){
    // console.log("id : " + transportId + " | index : " + index);
    (function(id, transports){

      var requestUrl = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyD3MxmmqvuEMX5090XYlxTnveg-ZDlNXP0&origin=" + req.query.dep.split(",")[0] + "," + req.query.dep.split(",")[1] + "&destination=" + req.query.arr.split(",")[0] + "," + req.query.arr.split(",")[1] + "&mode=" + transports[id]["type"];
      if(id > 2){
        requestUrl += "&transit_mode=" + transports[id]["subtype"];
      }
      console.log(requestUrl);



    })(transportId, transportationTypesArray);
  });



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
