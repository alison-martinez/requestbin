const config = require('../utils/config')
const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');

const { Client } = require('pg');

// need connection info for pg (below)
const pgClient = new Client({
  //host: config.PG_HOST,
  //port: config.PG_PORT,
  //user: config.PG_USER,
  //password: config.PG_PASSWORD,
  database: config.PG_DATABASE,
});

requestsRouter.use(bodyParser.json());

requestsRouter.get('/', (req, res) => {
  res.send('Hello, world');
});

requestsRouter.get('/api/:endpoint', (req, res) => {
  // Retrieve request data from mongo
});

requestsRouter.post('/api/:endpoint', (req, res) => {
  // Store incoming request data to Mongo
  console.log(req.body);

  res.send('ok');
});


requestsRouter.post('/', (req, res) => {
  // Store new endpoint in postgres
  res.send('ok');
});

module.exports = requestsRouter
