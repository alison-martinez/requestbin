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

pgClient.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

requestsRouter.get('/', (req, res) => {
  res.send('Hello, world');
});

requestsRouter.get('/bin/1', (req, res) => {
  //get list of all endpoints in that bin
    // //list all endpoints from the postgres database
    sql = "SELECT path FROM endpoints WHERE binID = 1"

    pgClient.connect().then((client) => {
      return client.query(sql, (error, results) => {
        if (error) {
          res.status(404).json("Error reading endpoints from postgres")
          client.release()
          console.log(error.stack)
        } else {
          res.status(200).json(JSON.stringify(results.rows));
          client.release()
        }
      })
    })
});

requestsRouter.get('/bin/1/endpoint/:endpoint', async (req, res) => {
  const currentPath = req.params.endpoint;
  const requests = await Request.find({ path: currentPath }).exec();
  res.json(requests);
  // do we need error handling?
});

requestsRouter.delete('/bin/1/endpoint/:endpoint', (request, response) => {
  const endpoint = request.params.endpoint;
  sql = "DELETE FROM endpoints WHERE path = $1"

  pgClient.connect().then((client) => {
    return client.query(sql, [endpoint], (error, results) => {
      if (error) {
        response.status(404).json("Error reading endpoint from postgres")
        client.release()
        console.log(error.stack)
      } else {
        response.status(201).json();
        client.release()
      }
    })
  })
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



requestsRouter.post('/bin/1/endpoint', async (req, res) => {
  const uniquePath = generateUniquePath();
  const customPath = req.body.endpoint || uniquePath
  console.log(customPath)

  const client = await pgClient.connect()
  try {
    const response = await client.query('INSERT INTO endpoints (path, binId) VALUES ($1, 1)', [customPath])
    res.status(200).json(`Unique path: ${customPath} added`)
  } catch (err) {
    res.status(403).json("Error in creating the endpoint on postgres")
    console.log(err.stack)
  } finally {
    client.release()
  }

})

module.exports = requestsRouter
