const { validationResult } = require('express-validator');

/**
 * Middleware that runs validation checks and formats standard validation errors
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: formattedDetails[0]?.message || 'Invalid request parameters',
        details: formattedDetails,
      },
    });
  };
};

module.exports = { validate };
