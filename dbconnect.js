//Import the mongoose module
var mongoose = require('mongoose');

require('dotenv').config()

const { MONGO_DB_CONN } = process.env

//Set up default mongoose connection
var mongoDB = MONGO_DB_CONN;
mongoose.connect(mongoDB)
    .then(result => {
        console.log('Connected');
    })
    .catch(err => {
        console.log(err);
    });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

module.exports = mongoose.connection;   