const config = require('../utils/config')
const requestsRouter = require('express').Router()
const Request = require('../models/request') // model for MongoDB
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const pg = require('pg');
const { response } = require('express');

const pgClient = new pg.Pool({ database: config.PG_DATABASE });

requestsRouter.use(bodyParser.json());

pgClient.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

requestsRouter.get('/endpoints', async (req, res) => {
  const client = await pgClient.connect();
  let value;

  try {
    const results = await client.query("SELECT path FROM endpoints WHERE binid = 1");
    res.status(200);
    value = JSON.stringify(results.rows);
    console.log(value);
  } catch (error) {
    res.status(404);
    value = "Error reading endpoints from postgresl"
    console.log(error);
  } finally {
    res.send(value);
    client.release();
  }
});

requestsRouter.get('/endpoints/:endpoint', async (req, res) => {
  const currentPath = req.params.endpoint;
  let value;
  try {
    const requests = await Request.find({ path: currentPath }).exec();
    value = requests;
  } catch (error) {
    value = "Error loading request data from MongoDB.";
    console.log(error);
  } finally {
    res.send(value)
  }
});

requestsRouter.delete('/endpoints/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  const client = await pgClient.connect();
  try {
    await client.query("DELETE FROM endpoints WHERE path = $1", [endpoint]);
    res.status(201).json();
  } catch (error) {
    res.status(404).json("Error reading endpoint forom Postgres");
    console.log(error);
  } finally {
    res.send();
    client.release();
  }
});

requestsRouter.post('/endpoints/create', async (req, res) => {
  const customPath = req.body.endpoint || uuidv4();
  const client = await pgClient.connect();
  let value;

  try {
    await client.query('INSERT INTO endpoints (path, binid) VALUES ($1, 1)', [customPath]);
    res.status(200);
    value = `Unique path: ${customPath} added.`;
  } catch (err) {
    res.status(403);
    value = "Error creating the endpoint in Postgres.";
    console.log(err);
  } finally {
    client.release();
    res.send(value);
  }
});

requestsRouter.post('/api/:endpoint', async (req, res) => {
  const path = req.params.endpoint;
  const header = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);
  const request = new Request({
    path: path,
    headers: header,
    body: body,
  });

  let value;

  try {
    const savedRequest = await request.save();
    value = savedRequest;
    // res.send(savedRequest);
    res.status(200);
  } catch (error) {
    res.status(403);
    value = "Error adding data to MongoDB.";
  } finally {
    res.send(value);
  }
});

module.exports = requestsRouter;
