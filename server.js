// Load variables from .env & Set default node enviroment to development.
require('dotenv').load()

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')

const config = require('./config');
const db = require('./db');
const routes = require('./app/routes');

// Connect to db.
db.connection();

// Setup server.
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API
app.use(routes);

const server = app.listen(config.port);
const host = server.address().address;
const port = server.address().port;
console.log(`=> Influencer Detector API running on http://${host}:${port}`);