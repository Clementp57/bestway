var redis = require('redis');


var redisClient = {
  instance: null,
  connect : (callback) => {
    return new Promise((resolve, reject) => {
       redisClient.instance = redis.createClient('6379', 'redis');
       redisClient.instance.on('connect', () => {
          console.info('Initialized redis instance');
          resolve();
       });
    })
  },
  getInstance: () => {
    return new Promise((resolve, reject) => {
      if(!redisClient.instance) {
        redisClient.instance.connect().then(() => {
          resolve(redisClient.instance);
        }, (error) => {
          console.log('error tryin to get redis instance');
        });
      } else {
        resolve(redisClient.instance);
      }
    });
    
  }
}

module.exports = redisClient;
