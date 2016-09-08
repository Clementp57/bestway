var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    http = require('http');

var validateRequest = ('./middlewares/validateRequest'),
    validateToken = ('./middlewares/validateToken'),
    routes = require('./routes/index'),
    public_routes = require('./routes/public'),
    mongodb = require('./services/mongodb'),
    redis = require('./services/redis');
    users = require('./routes/users');

var User = require('./models/User');
var API_BASE_PATH = "/api/v1";

// Connecting to databases
mongodb.connect();
redis.connect(function() {});

var serverInstance = express();
serverInstance.use(cors());
serverInstance.use(morgan('combined'));
serverInstance.use(bodyParser.json({limit: '16mb'})); // support json encoded bodies
serverInstance.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
})); // support encoded bodies

// Routing
serverInstance.all(API_BASE_PATH + '/*' , [
    require('./middlewares/validateToken'),
    require('./middlewares/validateRequest')
]);

serverInstance.all('/public/*', public_routes);
serverInstance.use(API_BASE_PATH+'/users', users);
serverInstance.use(API_BASE_PATH, routes);

// HAProxy health check
serverInstance.get('/', function (req, res) {
  res.send('<html><body>Hello from Node.js container </body></html>');
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
