const { Database } = require('mongorito');
const mongodb = new Database('localhost/lebo_admin', {
  reconnectTries: 5
});
mongodb.connect();
module.exports = mongodb;