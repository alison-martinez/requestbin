const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/api/:endpoint', (req, res) => {
  // Store incoming request data
  console.log(req.body);

  res.send('ok');
});

app.get('/api/:endpoint', (req, res) => {
  // Retrieve request data from mongo
  

  res.send();
});

app.get('/', (req, res) => {

  res.send('Hello, world');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});