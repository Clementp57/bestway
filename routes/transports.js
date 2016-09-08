var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

// Request API route
// url sample : /api/v1/sortedTransportsLists?dep=48.856614,2.352222&arr=48.856614,2.352222&transp=1,3,4
router.get('/', function(req, res){
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

module.exports = router;
