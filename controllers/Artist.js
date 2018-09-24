// CONTROLLERS

const Artist = require('../models/Artist.js');

// Controller for handling '/Artist' post requests
exports.createArtist = (req, res) => {
  // Oh you've sent us some information have you?
  // Well let's create a new artist record so we have somewhere to store it
  // This creates a new 'Artist' based on the 'artistSchema' schema
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });
  // Save the new artist object/ record to Mongo DB
  artist.save((err, artistCreated) => {
    if (err) {
      res.send("There was an error");
    }
    // Same as res.send, except you're sending json, I think?
    res.json(artistCreated);
  });
};

// Controller for handling '/Artist' get requests

exports.listArtists = (req, res) => {
  // I think you have to have an empty object literall to match, because Mongoose's find function requires it
  // However if you include an empty one, every record should be returned...?
  Artist.find({}, (err, artists) => {
    if (err) {
      res.json('Something went wrong, please try again.');
    }
    res.json(artists);
  });
};

exports.getArtist = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Could not find artist');
    }
    res.json(artist);
  });
};

