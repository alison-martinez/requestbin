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

requestsRouter.get('/', (req, res) => {
  sql = "SELECT path FROM endpoints WHERE binID = 1"

  pgClient.connect().then((client) => {
    return client.query(sql, (error, results) => {
      if (error) {
        res.status(404).json("Error reading endpoints from postgres");
        client.release();
        console.log(error.stack);
      } else {
        res.status(200).json(JSON.stringify(results.rows));
        client.release();
      }
    });
  });
});

requestsRouter.get('/:endpoint', async (req, res) => {
  const currentPath = req.params.endpoint;
  try {
    const requests = await Request.find({ path: currentPath }).exec();
    console.log(currentPath);
    res.json(requests);
  } catch (error) {
    console.log(error);
  }
});

requestsRouter.delete('/:endpoint', (request, response) => {
  const endpoint = request.params.endpoint;
  sql = "DELETE FROM endpoints WHERE path = $1";

  pgClient.connect().then((client) => {
    return client.query(sql, [endpoint], (error, results) => {
      if (error) {
        response.status(404).json("Error reading endpoint from postgres");
        client.release();
        console.log(error.stack);
      } else {
        response.status(201).json();
        client.release();
      }
    });
  });
});

requestsRouter.post('/create', async (req, res) => {
  const customPath = req.body.endpoint || uuidv4();

  const client = await pgClient.connect();
  try {
    await client.query('INSERT INTO endpoints (path, binid) VALUES ($1, 1)', [customPath]);
    res.status(200).json(`Unique path: ${customPath} added`);
  } catch (err) {
    res.status(403).json("Error in creating the endpoint on postgres");
    console.log(err);
  } finally {
    client.release();
  }
});

requestsRouter.post('/:endpoint', async (req, res) => {
  const path = req.params.endpoint;
  const header = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);
  const request = new Request({
    path: path,
    headers: header,
    body: body,
  });

  try {
    const savedRequest = await request.save();
    res.send(savedRequest);
    res.status(200);
  } catch {
    console.log("error");
    res.status(403);
  } finally {
    res.end();
  }
});

module.exports = requestsRouter;
