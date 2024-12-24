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

const loginRequest = () => {
  return [
    body("email", "email is required").notEmpty(),
    body("password", "password is required").notEmpty(),
    body(
      "email_verification_required",
      "email_verification_required is required"
    ),
  ];
};

const registerRequest = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address")
      .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    body("passwordConfirmation")
      .notEmpty()
      .withMessage("Password confirmation is required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
    body("roleId").notEmpty().withMessage("Role ID is required"),
  ];
};

const profileRequest = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_.]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores, and periods"
      ),

    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters"),

    // body("twitterHandle")
    //   .optional()
    //   .matches(/^@?(\w){1,15}$/)
    //   .withMessage("Twitter handle must be a valid format (e.g., '@username')"),

    // body("instagramHandle")
    //   .optional()
    //   .matches(/^@?([a-zA-Z0-9._]){1,30}$/)
    //   .withMessage(
    //     "Instagram handle must be a valid format (e.g., '@username')"
    //   ),

    // body("otherLink")
    //   .optional()
    //   .isURL()
    //   .withMessage("Other link must be a valid URL"),
  ];
};
const genreRequest = () => {
  return [
    body("genre")
      .notEmpty()
      .withMessage("Genre is required")
      .custom((value) => {
        // Ensure genre is a JSON object or an array
        if (typeof value !== "object" && !Array.isArray(value)) {
          throw new Error("Genre must be a JSON object or array.");
        }
        return true;
      }),
  ];
};

// const registerRequest = () => {
//   return [
//     body('firstName').notEmpty().withMessage('First name is required'),
//     body('lastName').notEmpty().withMessage('Last name is required'),
//     body('paymentType').notEmpty().withMessage('Payment type is required'),
//     body('baseUrl').notEmpty().withMessage('Base URL is required'),
//     body('email')
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Invalid email address')
//       .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).withMessage('Invalid email format'),
//       body('organizationEmail')
//       .notEmpty().withMessage('OrganizationEmail is required')
//       .isEmail().withMessage('Invalid email address')
//       .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).withMessage('Invalid email format'),
//       // .custom(async (value) => {
//       //   // Add your unique email validation logic here (e.g., checking against your database)
//       //   // Check if the email already exists in the User model
//       //   const existingUser = await User.findOne({ where: { email: value } });
//       //   if (existingUser) {
//       //     return Promise.reject('Email already exists');
//       //   }
//       //   return true;
//       // }).withMessage('Email already exists'),
//     body('password').notEmpty().withMessage('Password is required'),
//     body('passwordConfirmation')
//       .notEmpty().withMessage('Password confirmation is required')
//       .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
//     body('organizationName')
//       .notEmpty().withMessage('Organization name is required'),
//       // .custom(async (value) => {
//       //   // Add your unique organization name validation logic here
//       //   const existingOrganization = await Organization.findOne({ where: { name: value } });
//       //   if (existingOrganization) {
//       //     return Promise.reject('Organization with name already exists');
//       //   }
//       //   return true;
//       // }).withMessage('Organization name already exists'),
//     body('organizationAddress').notEmpty().withMessage('Organization address is required'),
//     body('domain')
//       .notEmpty().withMessage('Domain is required'),
//       // .custom(async (value) => {
//       //   // Add your unique domain validation logic here
//       //   const existingOrganizationDomain = await Organization.findOne({ where: { domain: value } });
//       //   if (existingOrganizationDomain) {
//       //     return Promise.reject('Organization with domain already exists');
//       //   }
//       //   return true;
//       // }).withMessage('Domain already exists'),
//     body('phoneNumber').notEmpty().withMessage('Phone number is required'),
//     body('logoImage')
//         .optional({ nullable: true })
//         .custom((value, { req }) => {
//         if (!value) {
//             // If logo_image is not provided, consider it valid
//             return true;
//         }

//         const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         const mimeType = value.mimetype;

//         if (!allowedMimeTypes.includes(mimeType)) {
//             return Promise.reject('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
//         }

//         return true;
//     }),
//   ];
// };

const createOrganizationRequest = () => {
  return [
    body("paymentType").notEmpty().withMessage("Payment type is required"),
    body("organizationEmail")
      .notEmpty()
      .withMessage("OrganizationEmail is required")
      .isEmail()
      .withMessage("Invalid email address")
      .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      .withMessage("Invalid email format"),
    body("organizationName")
      .notEmpty()
      .withMessage("Organization name is required"),
    body("organizationAddress")
      .notEmpty()
      .withMessage("Organization address is required"),
    body("type").notEmpty().withMessage("type is required"),
    body("size").notEmpty().withMessage("size is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  ];
};

const updateRequest = () => {
  return [
    body("organizationEmail")
      .notEmpty()
      .withMessage("irganizationEmail is required")
      .isEmail()
      .withMessage("Invalid email address")
      .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      .withMessage("Invalid email format"),
    body("organizationName")
      .notEmpty()
      .withMessage("Organization name is required"),
    body("organizationAddress")
      .notEmpty()
      .withMessage("Organization address is required"),
    body("domain").notEmpty().withMessage("Domain is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("logoImage")
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (!value) {
          // If logo_image is not provided, consider it valid
          return true;
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        const mimeType = value.mimetype;

        if (!allowedMimeTypes.includes(mimeType)) {
          return Promise.reject(
            "Invalid image format. Only JPEG, PNG, and GIF are allowed."
          );
        }

        return true;
      }),
  ];
};

const forgotPasswordRequest = () => {
  return [
    body("email", "Email is required").notEmpty(),
    body("baseUrl").notEmpty().withMessage("Base URL is required"),
  ];
};

const resetPasswordRequest = () => {
  return [
    body("email", "Email is required").notEmpty(),
    // body("otp", "OTP is required").notEmpty().isInt(),
    body("password", "Password is required").notEmpty(),
    // body('passwordConfirmation')
    //   .notEmpty().withMessage('Password confirmation is required')
    //   .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  ];
};

const emailVerificationRequest = () => {
  return [
    body("email", "Email is required").notEmpty(),
    body("otp", "OTP is required").notEmpty().isInt(),
  ];
};

const resendEmailVerificationRequest = () => {
  return [
    body("email", "Email is required").notEmpty(),
    body("baseUrl", "baseUrl is required").notEmpty(),
  ];
};
module.exports = {
  validate,
  okvalidate,
  loginRequest,
  registerRequest,
  profileRequest,
  genreRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  updateRequest,
  emailVerificationRequest,
  resendEmailVerificationRequest,
  createOrganizationRequest,
};
