const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dbHandler = require('./dbHandler');
const morgan = require('morgan');

module.exports = app;

const PORT = process.env.PORT || 4000;

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Use morgan for debugging
app.use(morgan('tiny'));

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./api/api');
app.use('/api', apiRouter);

//Get database ready
//dbHandler.refresh();

// This conditional is here for testing purposes:
if (!module.parent) {
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, function () {
    console.log(`CORS-enabled web server listening on port ${PORT}`)
  });
}
