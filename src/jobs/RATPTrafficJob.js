var http = require('http');
var mailer = require('../services/mailer');
var redis = require('../services/redis');

var job = () => {
  var requestOptions = {
    host: 'api-ratp.pierre-grimaud.fr',
    port: 80,
    path: '/v2/traffic'
  };

  var promise = new Promise((resolve, reject) => {
    var body = '';
    http.get(requestOptions, (res) => {
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });

      res.on('error', (error) => {
        res.on('error', (error) => {
          mailer.sendJobFailureMail('WeatherForecastJob', error);
        });
      });

    });
  });

  promise.then((result) => {
    redis.getInstance().then((redisInstance) => {
      result.response.metros.forEach((metro) => {
        //console.log("TRAFFIC_METRO_"+ metro.line);
        redisInstance.set("TRAFFIC_SUBWAY_"+ metro.line, JSON.stringify(metro));  
      });

      result.response.rers.forEach((rer) => {
        //console.log("TRAFFIC_RER_"+ rer.line);
        redisInstance.set("TRAFFIC_RER_"+ rer.line, JSON.stringify(rer));  
      });

      result.response.tramways.forEach((tram) => {
        //console.log("TRAFFIC_TRAM_"+ tram.line);
        redisInstance.set("TRAFFIC_TRAM_"+ tram.line, JSON.stringify(tram));  
      });
      console.log("Done saving ratp traffic");
    });

  });
}

module.exports = {
  executeJob: job
};
