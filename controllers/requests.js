const config = require('../utils/config')
const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// const { Client } = require('pg');
const pg = require('pg');
const { response } = require('express');

// need connection info for pg (below)
// const pgClient = new Client({
//   //host: config.PG_HOST,
//   //port: config.PG_PORT,
//   //user: config.PG_USER,
//   //password: config.PG_PASSWORD,
//   database: config.PG_DATABASE,
// });
const pgClient = new pg.Pool({database:config.PG_DATABASE})

requestsRouter.use(bodyParser.json());

requestsRouter.get('/', (req, res) => {
  res.send('Hello, world');
});

requestsRouter.get('/bin/1', (req, res) => {
  //get list of all endpoints in that bin
    // //list all endpoints from the postgres database
    sql = "SELECT path FROM endpoints WHERE binID = 1"
    pgClient.query(sql, (error,results) => {
      if (error) {
        res.status(404).json("Error reading endpoints from postgres")
      }
      res.status(200).json(JSON.stringify(results.rows));
    })
});

requestsRouter.get('/bin/1/endpoint/:endpoint', async (req, res) => {
  const currentPath = req.params.endpoint;
  const requests = await Request.find({ path: currentPath }).exec();
  res.json(requests);
  // do we need error handling?
});

requestsRouter.post('/bin/1/endpoint/:endpoint', async (req, res) => {
  // Store incoming request data to Mongo for that endpoint
  const path = req.params.endpoint;
  const header = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);

  const request = new Request({
    path: path,
    headers: header,
    body: body,
  });

  const savedRequest = await request.save();

  if (savedRequest) {
    res.send(savedRequest);
  } else {
    console.log("error");
  }
  res.status(200).end();
});

const generateUniquePath = () => {
  return uuidv4();
};



requestsRouter.post('/bin/1/endpoint', (req, res) => {
  // Store new endpoint path in postgres
  // Store new endpoint in postgres
  let uniquePath = generateUniquePath();
  customPath = req.body.endpoint || uniquePath
  pgClient.connect()
  sql = 'INSERT INTO endpoints (path, binId) VALUES ($1, 1)'
  pgClient.query(sql, [customPath], error => {
    if (error) {
      res.status(403).json("Error in creating the endpoint on postgres")
      console.log(error);
    }  else {
      res.status(200).json(`Unique path: ${customPath} added`)
    }
  })
  return customPath
});

module.exports = requestsRouter
