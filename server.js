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
//...always cors before routing
app.use(cors());

// OAuth2 authentiaction variables and configuration
require('dotenv').config();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  // This must match the algorithm selectedin the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ['RS256']
});

// Serve static files from the assets directory
app.use(express.static('assets'));

const authMiddleware = require('./src/auth');

// Import DB
var db_connect = require('./src/dbconnect');

// Import Routers
const router = require('./src/routes/client');
const adminRouter = require('./src/routes/admin');

// Bind connection to error event (to get notification of connection errors)
db_connect.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//...push every request through okta's middleware
//app.use(authMiddleware);

//...set our port
var port = process.env.PORT || 8001;

// ROUTES FOR THE API
// =============================================================================

//...test route to make sure everything is working (accessed at GET http://localhost:8001/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! ...and welcome to my api!' });
});

// REGISTER THE ROUTERS HERE
// =============================================================================
app.use(router);
app.use('/admin', adminRouter);

// set heroku environment path to app
if (process.env.NODE_ENV === 'production') {}

// START THE SERVER
// =============================================================================
const startServer = async () => {
  await promisify(app.listen).bind(app)(port);
  console.log('Magic happens on port ' + port);
};

startServer();
