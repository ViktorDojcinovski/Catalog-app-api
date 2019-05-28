
// BASE SETUP
// =============================================================================

// Call the dependencies for our REST server:
// 1. call express
var express = require('express'); 
// 2. define our app using express   
var app = express();  
// 3. allow us to pull POST content from  our HTTP request      
var bodyParser = require('body-parser');
// 4. make promise of every callback that you expect
var { promisify } = require('util');
// 5. Use cors for dodging that obnoxios CORS confinement
var cors = require('cors');
// always cors before routing
app.use(cors());


//OAuth2 authentiaction variables and configuration
require('dotenv').config();

const authMiddleware = require('./auth')


// Import DB
var db_connect = require('./dbconnect');

//Import Routes
const router = require('./app/routes/admin');

//Bind connection to error event (to get notification of connection errors)
db_connect.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// push every request through okta's middleware
app.use(authMiddleware);

// set our port
var port = process.env.PORT || 8001;        

// ROUTES FOR THE API
// =============================================================================

// test route to make sure everything is working (accessed at GET http://localhost:8001/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to my api!' });   
});

// register routes here

// REGISTER THE ROUTES -------------------------------
app.use('/admin', router);

// START THE SERVER
// =============================================================================
const startServer = async () => {
    await promisify(app.listen).bind(app)(port);
    console.log('Magic happens on port ' + port);
}

startServer();