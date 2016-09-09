var mongoose = require('mongoose');

var DATABASE_NAME = "bestway";

var mongodb = {
  connect : function() {
    mongoose.connect("mongodb://mongo:27017/" + DATABASE_NAME, function(error) {
      if(error) {
        console.log('Failed to connect mongod instance, please check mongodb is installed on your system and mongod instance is running on port 27017');
        console.error('Error:' + error);
      } else {
        console.log('Mongodb connection established');
      }
    });
  }
}

module.exports = mongodb;
