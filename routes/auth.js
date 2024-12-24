const express = require("express");
const AuthController = require("../app/controllers/AuthController");
const { loginRequest, registerRequest, profileRequest, validate } = require("../app/services/Validation/Auth/AuthRequestValidation")
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route("/auth/roles")
  .get(
    AuthController.getRoles
  );

router
  .route("/auth/login")
  .post(
    loginRequest(),
    validate,
    AuthController.login
  );

router
  .route("/auth/register")
  .post(
    registerRequest(),
    validate,
    AuthController.register
  );

router.post('/auth/email-verification', AuthController.verifyEmail);

router.post('/auth/resend-verification-otp', AuthController.resendVerificationOtp);

router.post('/auth/forgot-password', AuthController.forgotPassword);

router.post('/auth/reset-password', AuthController.resetPassword);

router.post('/auth/refresh-token', AuthController.refreshToken);

module.exports = router;
