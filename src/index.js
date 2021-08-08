const app = require('./server');
const config = require('./config');

app.listen(config.PORT, () =>
  console.info(
    `App listening at http://localhost:${config.PORT}. Environment: ${config.ENV}`
  )
);
