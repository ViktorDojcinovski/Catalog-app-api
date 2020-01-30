// Import the mongoose module
var mongoose = require('mongoose');

require('dotenv').config();

// Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected');
  })
  .catch(err => {
    console.log(err);
  });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

module.exports = mongoose.connection;
