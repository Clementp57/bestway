var http = require('http');
var RATPTraffic = require('../models/RATPTraffic');


var job = function() {
  var requestOptions = {
    host: 'api-ratp.pierre-grimaud.fr',
    port: 80,
    path: '/v2/traffic'
  };

  http.get(requestOptions, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var response = JSON.parse(body);

        // save metro entries
        for (var i = 0; i < response["response"]["metros"].length; i++) {

            var object = response["response"]["metros"][i];
            var ratpTrafficMetro = new RATPTraffic({
              id: "metro" + object["line"],
              type: "metro",
              line: object["line"],
              slug: object["slug"],
              message: object["message"]
            });
            (function(obj, ratpObject){

            RATPTraffic.findById("metro" + obj["line"], function(error, response){

                if(error){
                  console.log("entry with id metro" + obj["line"]);


                    ratpObject.save(function(error, response){
                      if(error){
                        console.log("•••error : " + error);
                      }
                      console.log("response : " + response);
                    });
                } else {
                  console.log("response : " + response);
                }
            });
          })(object, ratpTrafficMetro);



        }

        // save rer entries
        for (var i = 0; i < response["response"]["rers"].length; i++) {
          var object = response["response"]["rers"][i];
          var ratpTrafficRer = new RATPTraffic({
            id: "rer" + object["line"],
            type: "rer",
            line: object["line"],
            slug: object["slug"],
            message: object["message"]
          });
          // ratpTrafficRer.save(function(error, response){
          //   if(error){
          //     console.log("•••error : " + error);
          //   }
          //   console.log("response : " + response);
          // })
        }

        // save tramway entries
        for (var i = 0; i < response["response"]["tramways"].length; i++) {
          var object = response["response"]["tramways"][i];
          var ratpTrafficTram = new RATPTraffic({
            id: "tram" + object["line"],
            type: "tram",
            line: object["line"],
            slug: object["slug"],
            message: object["message"]
          });
          // ratpTrafficTram.save(function(error, response){
          //   if(error){
          //     console.log("•••error : " + error);
          //   }
          //   console.log("response : " + response);
          // })
        }



        // log BDD
        RATPTraffic.find({}).exec(function(error, data){
          console.log("BDD LOG | data : " + data);
        });

        // Drop RATPTraffic entries
        // RATPTraffic.remove({}, function (err) {
        //   if (err) return handleError(err);
        //     console.log("removed !!");
        // });


    });
  });
}

module.exports = {
    executeJob : job
};
