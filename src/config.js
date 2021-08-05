require('dotenv').config();

const env = process.env;

module.exports = {
  ENV: env.NODE_ENV,
  PORT: +env.PORT,

  JWT_SECRET: env.JWT_SECRET,
  JWT_ALGORITHM: env.JWT_ALGORITHM,
  JWT_ISSUER: env.JWT_ISSUER,

  MYSQL_CONNECTION: env.MYSQL_CONNECTION,
};
