const config = require('../utils/config')
const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');

// const { Client } = require('pg');
const pg = require('pg')

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
    sql = "SELECT * FROM endpoints WHERE binID = 1"
    pgClient.query(sql, (error,results) => {
      if (error) {
        res.status(404).json("Error reading endpoints from postgres")
      }
      res.status(200).json(JSON.stringify(results.rows));
    })
  
});

requestsRouter.get('/bin/1/endpoint/:endpoint', (req, res) => {
  // Retrieve request data from mongo for ONE endpoint
});

requestsRouter.post('/bin/1/endpoint/:endpoint', (req, res) => {
  // Store incoming request data to Mongo for that endpoint
  console.log(req.body);

  res.send('ok');
});

// #fix me
generateUniquePath = () => {
  return "uniquePath41"
}


requestsRouter.post('/bin/1/endpoint', (req, res) => {
  // Store new endpoint path in postgres
  // Store new endpoint in postgres
  let uniquePath = generateUniquePath()
  pgClient.connect()
  sql = 'INSERT INTO endpoints (path, binId) VALUES ($1, 1)'
  pgClient.query(sql, [uniquePath], error => {
    if (error) {
      res.status(403).json("Error in creating the endpoint on postgres")
    }  else {
      res.status(200).json(`Unique path: ${uniquePath} added`)
    }
  })
});

module.exports = requestsRouter
