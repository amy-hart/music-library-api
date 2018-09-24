// TESTS

const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { createArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// Require in the settings environment file
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

// Connect to our test database before running any test
describe('Artist POST Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });  
  it('should create a new Artist', (done) => {
    expect.assertions(2);
    // Create mock HTTP request for sending new Artist data
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/Artist',
      body: {
        name: 'The Human League',
        genre: 'Pop',
      },
    });
    // Create mock HTTP response 
    const response = httpMocks.createResponse({
      // Trigger an 'end' event for the response
      eventEmitter: events.EventEmitter,
    });
    // Call our controller/ handler function for Artist post requests - Pass in the mock request and response objects
    createArtist(request, response);

    response.on('end', () => {
      
      let artistCreated = JSON.parse(response._getData()); //eslint-disable-line
      expect(artistCreated.name).toBe('The Human League');
      expect(artistCreated.genre).toBe('Pop');
      done();

    });
  }) // End IT
  afterAll((done) => {
    mongoose.disconnect().then(() => {
      setTimeout(done, 500)
    });
  });
}) // End describe 

