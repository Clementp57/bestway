var Memcached = require('memcached');

var memcached = {
  instance: null,
  connect : function() {
    memcached.instance = new Memcached('127.0.0.1:11211');
  },
  getInstance: function() {
    if(!memcached.instance) {
      memcached.connect();
    }
    return memcached.instance;
  }
}

module.exports = memcached;
