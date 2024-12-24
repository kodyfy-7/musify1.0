const Sequelize = require("sequelize");
const moment = require("moment-timezone");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sequelize = require("../../database/PostgresDb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Role = require("../../models/Role");
const HelperService = require("../../app/services/HelperService");
// const MailService = require("../../app/services/MailService");
// const { welcomeMailTemplate } = require("../services/TemplateService");
const platform = require("platform");
const mailGenerator = require("../../config/mail");
const { transporter, mailOptions } = require("../../config/transporter");
const { required } = require("joi");
// const Designation = require("../../models/Designation");
// const EmailVerification = require("../../models/EmailVerification");

// exports.testMail = async (req, res, next) => {
//   try {
//     await MailService.sendMail(
//       "Welcome to Service School House!",
//       welcomeMailTemplate("Uche Ogbechie", "123"),
//       "ucheofunne.o@gmail.com"
//     );

//     return res.send({ yu: "123" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({
      where: {
        slug: {
          [Sequelize.Op.in]: ["artiste", "investor"],
        },
      },
      attributes: ["id", "name"],
    });

    return res.status(200).send({
      success: true,
      data: {
        roles,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberToken } = req.body;

    // Check if user exists
    const user = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("users.email")),
            email.toLowerCase()
          ),
        ],
      },
      include: [
        {
          model: Role,
          as: "role",
          required: true,
        },
      ],
      attributes: ["id", "name", "password", "email", "emailVerifiedAt"],
    });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email address",
      });
    }

    if (user && !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // if (email_verification_required) {
    //   if (user.email_verified_at === null) {
    //     return res.status(401).send({
    //       success: false,
    //       message: "Please ensure you have verified your email address",
    //     });
    //   }
    // }

    if (rememberToken) {
      const rememberToken = HelperService.generateNumericOtp();
      await user.update({
        rememberToken,
      });
    }

    const token = this.generateToken(user.id);
    return res.status(200).send({
      success: true,
      data: {
        token,
        user: {
          user_id: user.id,
          name: user.name,
          email: user.email,
          emailVerifiedAt: user.emailVerifiedAt,
        },
        role_name: user.role.name,
        role_slug: user.role.slug,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, roleId } = req.body;

    const role = await Role.findOne({
      where: {
        id: roleId,
      },
      attributes: ["slug", "name"],
    });

    // Check if user exists
    const checkUser = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("users.email")),
            email.toLowerCase()
          ),
        ],
      },
      attributes: ["id"],
    });

    if (checkUser) {
      return res.status(400).send({
        success: false,
        message: "A user with this email address already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const rememberToken = HelperService.generateNumericOtp();
    const user = await User.create({
      email,
      password: hashPassword,
      roleId,
      rememberToken,
    });

    const token = this.generateToken(user.id);
    return res.status(201).send({
      success: true,
      data: {
        token,
        user: {
          user_id: user.id,
          name: null,
          email: user.email,
          email_verified_at: null,
        },
        role_name: role.name,
        role_slug: role.slug,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.saveProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, bio, twitterHandle, instagramHandle, otherLink } =
      req.body;

    // Check if user exists
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const usernameConflict = await User.findOne({
      where: {
        username,
        id: {
          [Sequelize.Op.ne]: userId,
        },
      },
    });

    if (usernameConflict) {
      return res.status(400).send({
        success: false,
        message: "Username is already taken",
      });
    }
    await user.update({
      username,
      bio,
      twitterHandle,
      instagramHandle,
      otherLink,
    });
    return res.status(200).send({
      success: true,
      message: "Profile saved successfully"
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.resendVerificationOtp = async (req, res) => {
  try {
    const { email, base_url, campaign_id } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "email_verified_at"],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email address does not exist.",
      });
    }

    if (user.email_verified_at) {
      return res.status(400).json({
        success: false,
        message: "Email address is already verified.",
      });
    }

    const otp = HelperService.generateNumericOtp();
    const verificationUrl = `${base_url}?otp=${otp}&email=${user.email}&campaign_id=${campaign_id}`;

    await EmailVerification.create({
      user_id: user.id,
      otp,
      verified: false,
      action: "registration",
    });

    // const emailTemplate = ResendVerificationOtpTemplate(
    //   name,
    //   bookingVenue,
    //   bookedDate,
    //   bookedTime,
    //   clientName,
    //   examTitle,
    //   otp
    // );

    // const emailBody = mailGenerator.generate(emailTemplate);
    // const emailText = mailGenerator.generatePlaintext(emailTemplate);

    // const options = {
    //   ...mailOptions,
    //   to: email,
    //   subject: "Booking Confirmation",
    //   html: emailBody,
    //   text: emailText,
    // };

    // await transporter.sendMail(options);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "System optimization in progress, please wait",
      error: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp, is_site_admin } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email address does not exist.",
      });
    }

    if (!is_site_admin) {
      const emailVerification = await EmailVerification.findOne({
        where: { user_id: user.id, otp },
      });

      if (!emailVerification) {
        return res.status(400).json({
          success: false,
          message: "Invalid activation link.",
        });
      }

      await emailVerification.update({
        verified: true,
        expired_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    await user.update({
      email_verified_at: new Date(),
    });

    const data = {
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
        profile_completion_status: user.profile_completion_status,
      },
      designation_name: null,
      designation_slug: null,
    };

    if (!is_site_admin) {
      const token = this.generateToken(user.id);
      data.token = token;
    }

    return res.status(200).json({
      success: true,
      message: "Email address verified successfully.",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "System optimization in progress, please wait",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, base_url, campaign_id } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "email_verified_at"],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email address does not exist.",
      });
    }

    const otp = HelperService.generateNumericOtp();
    const verificationUrl = `${base_url}?otp=${otp}&email=${user.email}&campaign_id=${campaign_id}`;

    await EmailVerification.create({
      user_id: user.id,
      otp,
      verified: false,
      action: "reset-password",
    });

    // const emailTemplate = ResendVerificationOtpTemplate(
    //   name,
    //   bookingVenue,
    //   bookedDate,
    //   bookedTime,
    //   clientName,
    //   examTitle,
    //   otp
    // );

    // const emailBody = mailGenerator.generate(emailTemplate);
    // const emailText = mailGenerator.generatePlaintext(emailTemplate);

    // const options = {
    //   ...mailOptions,
    //   to: email,
    //   subject: "Booking Confirmation",
    //   html: emailBody,
    //   text: emailText,
    // };

    // await transporter.sendMail(options);
    return res.status(200).json({
      success: true,
      message:
        "You have initiated a reset password, check your mailbox for verification link.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "System optimization in progress, please wait",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password, is_site_admin } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email address does not exist.",
      });
    }

    if (!is_site_admin) {
      const emailVerification = await EmailVerification.findOne({
        where: { user_id: user.id, otp, verified: false },
      });

      if (!emailVerification) {
        return res.status(400).json({
          success: false,
          message: "Invalid activation link.",
        });
      }

      await emailVerification.update({
        verified: true,
        expired_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    await user.update({
      password: await bcrypt.hash(password, 10),
      email_verified_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    const data = {
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
        profile_completion_status: user.profile_completion_status,
      },
      designation_name: null,
      designation_slug: null,
    };

    if (!is_site_admin) {
      const token = this.generateToken(user.id);
      data.token = token;
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "System optimization in progress, please wait",
      error: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { email, remember_token } = req.body;

    if (!email || !remember_token) {
      return res.status(400).json({
        success: false,
        message: "Email and remember token are required.",
      });
    }

    // Fetch user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the provided remember token matches
    const isTokenValid = await bcrypt.compare(
      remember_token,
      user.remember_token
    );

    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid remember token.",
      });
    }

    // Generate new JWT token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY } // e.g., '1h'
    );

    // Generate new remember token
    const newRememberToken = await bcrypt.hash(remember_token, 10);

    // Update user's remember token
    await user.update({ remember_token: newRememberToken });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        access_token: newAccessToken,
        remember_token: newRememberToken,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({
      success: false,
      message: "System optimization in progress, please wait.",
      error: error.message,
    });
  }
};

exports.generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};

exports.testEmail = async (req, res) => {
  const name = "Uche";
  const email = "ucheofunne.o@gmail.com";
  const otp = "123456";
  const verificationLink = "verifyNow";
  // Generate the email content
  const emailTemplate = welcomeEmailTemplate(name, otp, verificationLink);
  const emailBody = mailGenerator.generate(emailTemplate);
  const emailText = mailGenerator.generatePlaintext(emailTemplate);

  // Define email options
  const options = {
    ...mailOptions,
    to: email,
    subject:
      "Welcome to Service School House! Please verify your email and get started.",
    html: emailBody,
    text: emailText,
  };

  // Send the email
  try {
    // await sendMail('Welcome to Testassessify! Please verify your email.', emailBody, email, null, name);
    await transporter.sendMail(options);
    return res.status(200).send("Signup successful, welcome email sent.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Signup failed, could not send welcome email.");
  }
};

exports.testEmailNotifications = async (req, res) => {
  const emailType = req.query.emailType; // Assuming the variable is passed as a query parameter

  const name = "Uche";
  const email = "ucheofunne.o@gmail.com";

  let emailTemplate;
  let subject;

  switch (emailType) {
    case "welcome":
      const otp = "123456";
      const verificationLink = "verifyNow";
      emailTemplate = welcomeEmailTemplate(name, otp, verificationLink);
      subject =
        "Welcome to Service School House! Please verify your email and get started.";
      break;
    case "onboarding":
      const password = "123456";
      const loginLink = "https://growth.serviceschoolhouse.com/";
      const dashboardLink = "https://growth.serviceschoolhouse.com/dashboard";
      emailTemplate = onboardingEmailTemplate(
        name,
        email,
        password,
        loginLink,
        dashboardLink
      );
      subject =
        "Get Started with Service School House! Your onboarding journey awaits.";
      break;
    // Add more cases as needed
    default:
      return res.status(400).send("Invalid email type.");
  }

  const emailBody = mailGenerator.generate(emailTemplate);
  const emailText = mailGenerator.generatePlaintext(emailTemplate);

  const options = {
    ...mailOptions,
    to: email,
    subject: subject,
    html: emailBody,
    text: emailText,
  };

  try {
    // await sendMail(subject, emailBody, email, null, name);
    await transporter.sendMail(options);
    return res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to send email.");
  }
};
