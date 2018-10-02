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
const { deleteArtist } = require('../../controllers/Artist')

// require in our .env file which contains the credentials for our test database 
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('DELETE Artist endpoint', () => {

  // Open connection to test database 
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser : true }, done);
  });

  // Run tests
  it('TEST', (done) => {

    // Expect assertions
    expect.assertions(1);

    // Create an Artist to test
    const artist = new Artist({ name: 'Jacko', genre: 'Pop', });
    // Save that artist to the test database 
    artist.save((error, artistCreated) => {
      if (error) {
        console.log('There has been an error!');
      }

      console.log('Data returned: ',artistCreated);
      
      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._Id,
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      })

      deleteArtist(request, response);

      /*
      
      exports.deleteArtist = (req, res) => {
      Artist.findByIdAndRemove(req.params.artistId, (err, artist) => {
        if (err) {
          res.json('Could not find artist');
        }
        artist.save((deleteErr, artistDeleted) => {
          if (deleteErr) {
            res.json('Could not update')
          }
        })
        res.send(artist);
      });
    };

    */

      response.on('end', () => {
        console.log('Data returned: ',artistCreated);
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist.toString()).toBe(null);
          done();
        });
      })
    });

  }); // End test

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

}); // End describe 