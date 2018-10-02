// TEST - GET LIST OF ARTISTS

// Require in Mongoose for handling interactions with MongoDB
const mongoose = require('mongoose');

// Require in Path so it's easier to handle filepaths 
const path = require('path');

// Require in httpMocks so we can spoof http requests and responses (so we don't call our live API during testing)
const httpMocks = require('node-mocks-http');

// Require in events so we can spoof end events when our responses are complete
const events = require('events');

// Require in our Artist model, as we'll be creating artists before carrying our our tests
const Artist = require('../../models/Artist.js');

// Require in our controller for creating artists, as we'll be creating artists before carrying our our tests
const { createArtist } = require('../../controllers/Artist.js');

// Require in our controller for handling getList requests
const { listArtists } = require('../../controllers/Artist.js');

// Require in the settings.env file for the test database credentials 
// We need this because we need to add records to our DB before we can test getting them
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('List Artists endpoint', () => {

  // Open a connection to our test database
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser : true }, done)
  });

  // Test that we can bring back all of the Artist records from a collection
  it('Should retrieve A list of Artists record from database', (done) => {

    // Tell JEST how many assertions to expect inside this IT
    expect.assertions(2);

    // Create collection 
    let artists = [
      { name: 'tame impala', genre: 'rock', },
      { name: 'jamal', genre: '90s hiphop', },
      { name: 'Jeru the Damaja', genre: '90s hiphop', },
    ];

    // Does the same as .save()
    Artist.create(artists, function (err) {
      if (err) {
        console.log('Something went wrong');
      }

      // Aritsts created and saved successfully - Proceed with test
      // Create mock request
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/Artist',
      });

      // Create mock response
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      // Call getList handler and pass in request and response objects
      listArtists(request, response);

      // Call response.on and make assertions 
      response.on('end', () => {
        // assertions
        const listOfArtists = JSON.parse(response._getData());
        expect(listOfArtists).toHaveLength(3);
        console.log(listOfArtists);
        console.log(listOfArtists.length);
        const artistNames = listOfArtists.map(e => e.name);
        expect(artistNames).toEqual(expect.arrayContaining(['tame impala', 'jamal', 'Jeru the Damaja']));
        console.log(artistNames);

        // Let JEST know that our async requests are complete
        done();
      });
    }) 
  }) // End IT

  // Drop the collection from our test database 
  afterEach((done) => {
    Artist.collection.drop((error) => {
      if (error) {
          console.log(error);
      }
      done();
    });
  });

  // Close the connection to our test database 
  afterAll((done) => {
    mongoose.connection.close();
  });


}) // End describe