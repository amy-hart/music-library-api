// Mongoose handles MongoDB interactions 
const mongoose = require('mongoose');
// Path lets us use the path tool
const path = require('path');
// Allows us to create mock requests and responses so we don't have to call our live API during testing
const httpMocks = require('node-mocks-http');
//  Allows us to trigger events (such as an end event)
const events = require('events');
// Require in our Artist model - I assume we need to creat one before we can edit one
const Artist = require('../../models/Artist');
// Allows us to call our put handler 
const { putArtist } = require('../../controllers/Artist')

// require in our .env file which contains the credentials for our test database 
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

// Describe the tests you're gonna be running

describe('PUT Artist endpoint', () => {

  // Open connection to test database 
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser : true }, done);
  });

  // Run tests
  it('Should update an artist record when PUT endpoint is called', (done) => {
   // Expect assertions
   expect.assertions(1);
   
    // Create an Artist to test
    const artist = new Artist({ name: 'Coldplay', genre: 'Sad', });
    // Save that artist to the test database 
    artist.save((error, artistCreated) => {
      if (error) {
        console.log('There has been an error!');
      }
      // If saving was succesful proceed with the test
      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Coldplay',
          genre: 'Rock',
        },
      });

      console.log('request id: ',request.params.artistId);

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      // Call handler, pass in mock request, and response objects
      putArtist(request, response);

      response.on('end', () => {
        console.log('Entered response.on');
        // Take data sent with request, and assign to variable 
        const updatedArtist = JSON.parse(response._getData()); 
        console.log('response end data: ',updatedArtist);
        expect(updatedArtist).toEqual({
          _id: artistCreated._id.toString(),
          name: 'Coldplay',
          genre: 'Rock',
          __v: 0,
        });
        // Tell jest our async requests our finished
        done();
      })
    })
  })

  // Drop the collection
  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });

  // Close the connection to test database 
  afterAll((done) => {
    mongoose.connection.close();
  });
}) // End describe 