/* eslint-disable consistent-return */
const { body, validationResult, param } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    param: err.param,
    messsge: err.msg,
  }));

  return res.status(422).json({
    errors: extractedErrors,
    message: "Validation failed. Please check the provided data.",
  });
};

const okvalidate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(422).json({ errors: errors.array() });
  };
};

const projectRequest = () => {
  return [
    body("title", "Title is required").notEmpty(),
    body("description", "Gescription is required").notEmpty(),
    body("goal", "Goal is required").notEmpty(),
  ];
};

const accountRequest = () => {
  return [
    body("bankName", "Bank name is required").notEmpty(),
    body("bankAccountName", "Bank account name is required").notEmpty(),
    body("bankAccountNumber", "Bank account number is required")
      .notEmpty()
      .isLength({ max: 20 })
      .withMessage("Bank account number must not exceed 20 characters"),
    body("swiftCode", "SWIFT code is required").notEmpty(),
    body("bvn", "BVN is required").notEmpty(),
  ];
};

const musicRequest = () => {
  return [
    body("title", "Title is required").notEmpty(),
    body("description", "Description is required").notEmpty(),
    body("playlistId", "Playlist ID must be UUID").optional().isUUID(),
    body("musicUrl", "Music url is required").notEmpty(),
  ];
};

const albumRequest = () => {
  return [
    body("title", "Title is required").notEmpty(),
    body("description", "Description is required").notEmpty(),
    body("isPrivate", "Private must be boolean").isBoolean(),
  ];
};

const songRequest = () => {
  return [
    body("title", "Title is required").notEmpty(),
    body("description", "Description is required").notEmpty(),
    body("isPrivate", "Private must be boolean").isBoolean(),
    body("userAlbumId", "User album id must be UUID").optional().isUUID(),
    body("filePath", "File path is required").notEmpty(),
  ];
};

module.exports = {
  validate,
  okvalidate,
  projectRequest,
  accountRequest,
  musicRequest,
  albumRequest,
  songRequest
};
