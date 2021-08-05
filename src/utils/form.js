const { validator } = require('indicative');

const validate = async (data, rules) => {
  return await validator
    .validateAll(data, rules)
    .then(() => null)
    .catch((err) => err);
};

module.exports = validate;
