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

requestsRouter.get('/bin/1', (req, res) => {
  //get list of all endpoints in that bin
})

requestsRouter.get('/bin/1/endpoint/:endpoint', (req, res) => {
  // Retrieve request data from mongo for ONE endpoint
});

requestsRouter.post('/bin/1/endpoint/:endpoint', (req, res) => {
  // Store incoming request data to Mongo for that endpoint
  console.log(req.body);

  res.send('ok');
});


requestsRouter.post('/bin/1/endpoint', (req, res) => {
  // Store new endpoint path in postgres
  res.send('ok');
});

module.exports = requestsRouter
