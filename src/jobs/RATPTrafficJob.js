var http = require('http');
var RATPTraffic = require('../models/RATPTraffic');
var mailer = require('../services/mailer');


var job = () => {
  var requestOptions = {
    host: 'api-ratp.pierre-grimaud.fr',
    port: 80,
    path: '/v2/traffic'
  };

  // var promise = new Promise((resolve, reject) => {
  //   var body = '';
  //   http.get(requestOptions, (res) => {
  //     res.on('data', (chunk) => {
  //       body += chunk;
  //     });

  //     res.on('end', () => {

  //     });

  //     res.on('error', (error) => {
  //       res.on('error', (error) => {
  //         mailer.sendJobFailureMail('WeatherForecastJob', error);
  //       });
  //     });

  //   });




//     // save metro entries
//     for (var i = 0; i < response["response"]["metros"].length; i++) {

//       var metroObject = response["response"]["metros"][i];
//       var ratpTrafficMetro = new RATPTraffic({
//         name: "metro" + metroObject["line"],
//         type: "metro",
//         line: metroObject["line"],
//         slug: metroObject["slug"],
//         message: metroObject["message"]
//       });
//       (function (obj, ratpObject) {
//         RATPTraffic.find({ 'name': "metro" + obj["line"] }, function (error, response) {
//           if (error) {
//             console.log("•••error : " + error);
//           } else if (response == "") {
//             ratpObject.save(function (error, response) {
//               if (error) {
//                 console.log("•••error while saving new RATPTraffic : " + error);
//               } else {
//                 // console.log("saved new RATPTraffic object : " + response);
//               }
//             });
//           } else {
//             RATPTraffic.update({ 'name': response["name"] }, { 'slug': response["slug"], 'message': response["message"] }, {}, function (error, reponse) {
//               if (error) {
//                 console.log("•••error : " + error);
//               } else {
//                 // console.log("RATPTraffic object updated : " + response);
//               }
//             });
//           }
//         });
//       })(metroObject, ratpTrafficMetro);
//     }

//     // save rer entries
//     for (var i = 0; i < response["response"]["rers"].length; i++) {
//       var rerObject = response["response"]["rers"][i];
//       var ratpTrafficRer = new RATPTraffic({
//         name: "rer" + rerObject["line"],
//         type: "rer",
//         line: rerObject["line"],
//         slug: rerObject["slug"],
//         message: rerObject["message"]
//       });

//       (function (obj, ratpObject) {

//         RATPTraffic.find({ 'name': "rer" + obj["line"] }, function (error, response) {

//           if (error) {
//             console.log("•••error : " + error);
//           } else if (response == "") {
//             ratpObject.save(function (error, response) {
//               if (error) {
//                 console.log("•••error while saving new RATPTraffic : " + error);
//               } else {
//                 // console.log("saved new RATPTraffic object : " + response);
//               }
//             });
//           } else {
//             RATPTraffic.update({ 'name': response["name"] }, { 'slug': response["slug"], 'message': response["message"] }, {}, function (error, reponse) {
//               if (error) {
//                 console.log("•••error : " + error);
//               } else {
//                 // console.log("RATPTraffic object updated : " + response);
//               }
//             });
//           }
//         });
//       })(rerObject, ratpTrafficRer);
//     }

//     // save tramway entries
//     for (var i = 0; i < response["response"]["tramways"].length; i++) {
//       var tramObject = response["response"]["tramways"][i];
//       var ratpTrafficTram = new RATPTraffic({
//         name: "tram" + tramObject["line"],
//         type: "tram",
//         line: tramObject["line"],
//         slug: tramObject["slug"],
//         message: tramObject["message"]
//       });

//       (function (obj, ratpObject) {

//         RATPTraffic.find({ 'name': "tram" + obj["line"] }, function (error, response) {

//           if (error) {
//             console.log("•••error : " + error);
//           } else if (response == "") {
//             ratpObject.save(function (error, response) {
//               if (error) {
//                 console.log("•••error while saving new RATPTraffic : " + error);
//               } else {
//                 // console.log("saved new RATPTraffic object : " + response);
//               }
//             });
//           } else {
//             RATPTraffic.update({ 'name': response["name"] }, { 'slug': response["slug"], 'message': response["message"] }, {}, function (error, reponse) {
//               if (error) {
//                 console.log("•••error : " + error);
//               } else {
//                 // console.log("RATPTraffic object updated : " + response);
//               }
//             });
//           }
//         });
//       })(tramObject, ratpTrafficTram);
//     }
//   });
// });
}

module.exports = {
  executeJob: job
};
