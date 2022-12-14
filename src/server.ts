import express, { response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { setTimeout } from 'timers';


const fs = require('fs');
const path = require('path');
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage/", (req, res) => {
    let image_url: string = req.query.image_url;
      filterImageFromURL(image_url).then((response) => {
        if(response == "Error"){
          return res.status(400).send('Error getting image');
        }
        res.sendFile(response);
      });
    setTimeout(() => {
      // Then delete all the filtered files on the server
      let folderJsonPath = path.join('./', 'src', 'util', 'tmp');
      let listFilteredImages: string[] = new Array;
      fs.readdirSync(folderJsonPath).forEach((file: any) => {
        console.log("path: " + path.resolve(folderJsonPath, file));
        listFilteredImages.push(path.resolve(folderJsonPath, file));
      });
      deleteLocalFiles(listFilteredImages);
    }, 5000);

  });

  // Delete all filtered images
  // app.get('/deleteallfilteredimages/', (req, res) => {
  //   let folderJsonPath = path.join('./', 'src', 'util', 'tmp');
  //   let listFilteredImages = new Array;

  //   fs.readdirSync(folderJsonPath).forEach((file: any) => {
  //     console.log(file);
  //     listFilteredImages.push(path.resolve(folderJsonPath, file));
  //   });

  //   deleteLocalFiles(listFilteredImages);
  //   return res.send("Deleted all filtered images")
  // })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    let image_url: string = req.query.image_url;
    if (image_url == null) {
      return res.send(`Please input the image_url`);
    }
    res.send(`try GET /filteredimage?image_url=${image_url}`);
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();