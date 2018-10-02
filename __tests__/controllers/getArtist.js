// TEST - GET ARTIST BY ID

// Require Mongoose as a tool for handling MongoDB interactions 
const mongoose = require('mongoose');
// Require path, so it's easier to determine file paths
const path = require('path');
// Require httpMocks so we can spoof http requests, because making requests on a live API during testing is bad
const httpMocks = require('node-mocks-http');
// Require in events, because we need to spoof an end event for our responses
const events = require('events');
// Require in our controller for handling get requests
const { getArtist } = require('../../controllers/Artist'); 
// Require in our Artist model - Necessary for posting them in order to test them
const Artist = require('../../models/Artist');
// Require in our controller for creating artists, necessary for posting records ahead of testing them
const { createArtist } = require('../../controllers/Artist'); 


// Require in the settings.env file for the test database credentials 
// We need this because we need to add records to our DB before we can test getting them
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('GET Artist endpoint', () => {
  
  // Open connection to our test database
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser : true }, done)
  });

  it('Should retrieve Artist record from database', (done) => {

    // Tell JEST how many assertions to expect
    expect.assertions(2);

     // Create new artist object/ record based on the Artist model 
    const artist = new Artist({ 
      name: 'Wu-Tang Clan', 
      genre: 'HipHop', 
    });
    // Save this new artist to the test database 
    artist.save((error, artistCreated) => {
      if(error) {
        console.log(err, 'Something went wrong')
      }
      // After the artist has been saved, spoof a GET request
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id,
        },
      });
      // Spoof a response
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // call the GET handler for artist, pass in request and response objects
      getArtist(request, response);

      /*
      
      exports.getArtist = (req, res) => {
        Artist.findById(req.params.artistId, (err, artist) => {
          if (err) {
            res.json('Could not find artist');
          }
          res.json(artist);
        });
      };
      
      */

      // When the end event for the response has been triggered, do the following...
      response.on('end', () => {

        // create artistFound object, give it the properties sent across from the response 
        let artistFound = JSON.parse(response._getData());
    
        // Make our assertions
        expect(artistFound.name).toBe('Wu-Tang Clan');
        expect(artistFound.genre).toBe('HipHop');

        // Let JEST know that our async requests are complete
        done();
      });
    });    
  }) // End It

  afterEach((done) => {
    Artist.collection.drop((error) => {
      if (error) {
        console.log(error);
      }
      done();
    });
  });
  afterAll((done) => {
    mongoose.connection.close();
  });
}) // End Describe


