const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');

const { Client } = require('pg');

// need connection info for pg (below)
const pgClient = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
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
