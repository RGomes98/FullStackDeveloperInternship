import express from 'express';

import { parseResponseData } from './utils/parseResponseData.js';
import { API } from './lib/axios.js';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/scrape', async (req, res) => {
  const { keyword } = req.query;
  const query = keyword.split(' ').join('+');

  try {
    const { data } = await API.get(query);
    const parsedData = parseResponseData(data);

    res.status(200).send(JSON.stringify(parsedData));
  } catch (error) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
