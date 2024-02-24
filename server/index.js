import { parseResponseData } from './utils/parseResponseData.js';
import { API } from './lib/axios.js';

import express from 'express';

const app = express();
const port = 3000;

// Middleware to set CORS headers allowing requests from http://127.0.0.1:5500
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/scrape', async (req, res) => {
  // Extract the 'keyword' parameter from the query string
  const { keyword } = req.query;

  // Replace spaces in the keyword with '+' for URL encoding
  const query = keyword.split(' ').join('+');

  try {
    // Make a GET request to the Amazon URL using the 'query' parameter
    const { data } = await API.get(query);

    // Parse the response data obtained from the Amazon query using the parseResponseData function
    const parsedData = parseResponseData(data);

    // Send the parsed data back to the client with a success status code (200)
    res.status(200).send(JSON.stringify(parsedData));
  } catch (error) {
    // If an error occurs during the request or parsing, send an error response with status code 500
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
