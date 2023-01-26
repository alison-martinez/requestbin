const config = require('../utils/config')
const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// const { Client } = require('pg');
const pg = require('pg');
const { response } = require('express');
const { ClientSession } = require('mongoose/node_modules/mongodb');
const clients = [];

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


const getEndpoints = (req, res) => {
  //get list of all endpoints in that bin
    // //list all endpoints from the postgres database
    sql = "SELECT path FROM endpoints WHERE binID = 1"
    pgClient.query(sql, (error,results) => {
      if (error) {
        res.status(404).json("Error reading endpoints from postgres")
      }
      const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      };
      res.writeHead(200, headers);
      const data = JSON.stringify(results.rows);

      res.write(data);

      const clientId = Date.now();

      const newClient = {
        id: clientId, 
        response
      };

      clients.push(newClient);

      req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
      });
      
      res.status(200).json(JSON.stringify(results.rows));
    })
}


requestsRouter.get('/bin/1', getEndpoints);

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


const postEndpoint = (req, res) => {
  // Store new endpoint path in postgres
  // Store new endpoint in postgres
  let uniquePath = generateUniquePath();
  console.log(uniquePath);
  pgClient.connect()
  sql = 'INSERT INTO endpoints (path, binId) VALUES ($1, 1)'
  pgClient.query(sql, [uniquePath], error => {
    if (error) {
      res.status(403).json("Error in creating the endpoint on postgres")
      console.log(error);
    }  else {
      clients.forEach(client => client.res.write(uniquePath));
      res.status(200).json(`Unique path: ${uniquePath} added`)
    }
  })
};

requestsRouter.post('/bin/1/endpoint', postEndpoint );

module.exports = requestsRouter
