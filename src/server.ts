import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // URL Validator
  const validUrl = require('valid-url');
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    const image_url: string = req.query.image_url;

    if (!validUrl.isUri(image_url)) {
      res.send('The URL provided is not valid');
    }

    const filteredpath: string = await filterImageFromURL(image_url);

    res.sendFile(filteredpath, async function (err) {
      if (!err) {
        await deleteLocalFiles([filteredpath]);
      }
    });

  } );  

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();