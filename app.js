const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();

mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true });

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello MongoDB'));

app.listen(3000, () => console.log('App listening on port 3000...'));
