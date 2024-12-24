const joiValidator = require('./joi-validator');

module.exports =
  (schema, document = 'body') =>
  async (req, res, next) => {
    try {
      const value = await joiValidator.validate(req[document] || {}, schema);

      req[`${document}Old`] = req[document];
      req[document] = value;

      next();
    } catch (error) {
      console.error(error);
      res.status(400).json({
        status: false,
        error,
      });
    }
  };