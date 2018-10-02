const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const { createArtist } = require('./controllers/Artist.js');
const { listArtists } = require('./controllers/Artist.js');
const { getArtist } = require('./controllers/Artist.js');
const { putArtist } = require('./controllers/Artist.js');
const { deleteArtist } = require('./controllers/Artist.js');

const dotenv = require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();

mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true });

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello MongoDB'));

app.post('/Artist', createArtist);
app.get('/Artist', listArtists);
app.get('/Artist/:artistId', getArtist);
app.put('/Artist/:artistId', putArtist);
app.delete('/Artist/:artistId', deleteArtist);

app.listen(3000, () => console.log('App listening on port 3000...'));
