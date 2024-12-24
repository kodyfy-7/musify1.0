const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Role = require("../../models/Role");
const HelperService = require("../../app/services/HelperService");

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
