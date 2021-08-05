const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.listen(config.PORT, () =>
  console.info(
    `App listening at http://localhost:${config.PORT}. Environment: ${config.ENV}`
  )
);
