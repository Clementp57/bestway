var redis = require('redis');


var redisClient = {
  instance: null,
  connect : function(callback) {
    redisClient.instance = redis.createClient('6379', 'redis');
    redisClient.instance.on('connect', function() {
        console.info('Initialized redis instance');
        callback();
    });
  },
  getInstance: function() {
    if(!redisClient.instance) {
      redisClient.instance.connect(function() {
        return redisClient.instance;
      });
    }
    return redisClient.instance;
  }
}

module.exports = redisClient;
