const { Sequelize, Op, where } = require("sequelize");
const sequelize = require("../../database/PostgresDb");
const User = require("../../models/User");
const UserProject = require("../../models/UserProject");
const UserBankAccount = require("../../models/UserBankAccount");
const streamifier = require("streamifier");
const Follow = require("../../models/Follow");
const { uploader, config } = require("cloudinary").v2;
const HelperService = require("../services/HelperService");
const UserGenre = require("../../models/UserGenre");

config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.saveProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, username, bio, twitterHandle, instagramHandle, otherLink } =
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
      name,
      username,
      bio,
      twitterHandle,
      instagramHandle,
      otherLink,
    });
    return res.status(200).send({
      success: true,
      message: "Profile saved successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.saveImages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Ensure the user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const updateData = {};

    // Handle profile image upload
    if (req.files && req.files.profileImage) {
      const profileImage = req.files.profileImage[0];
      const profileImageUpload = await uploadFile(profileImage);
      updateData.profileImage = profileImageUpload.secure_url;
    }

    // Handle profile header upload
    if (req.files && req.files.profileHeader) {
      const profileHeader = req.files.profileHeader[0];
      const profileHeaderUpload = await uploadFile(profileHeader);
      updateData.profileHeader = profileHeaderUpload.secure_url;
    }

    // Ensure at least one field is updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({
        success: false,
        message:
          "At least one of 'profileImage' or 'profileHeader' must be provided.",
      });
    }

    // Update user
    await user.update(updateData);

    return res.status(200).send({
      success: true,
      message: "Image data saved successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to upload a file to Cloudinary
async function uploadFile(file) {
  const uploadOptions = {
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };

  return new Promise((resolve, reject) => {
    const stream = uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

exports.saveProjectInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description, goal } = req.body;

    // Find the user
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Update the user
    await UserProject.create({
      userId,
      title,
      description,
      goal,
    });

    return res.status(200).send({
      success: true,
      message: "Project saved successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getArtisteProjects = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const {
      attributes,
      page = 1,
      perPage = 25,
      sortBy,
      sort = "createdAt:desc",
      order,
      status,
      search,
      include: includes,
      ...otherAttributes
    } = req.query;

    // Find the user
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    let whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    // Update the user
    const projects = await UserProject.findAndCountAll({
      where: {
        userId,
      },
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: projects.count,
      page,
      perPage,
    });

    return res.status(200).send({
      success: true,
      data: { success: true, data: projects.rows, meta },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getArtisteProfile = async (req, res, next) => {
  try {
    const {
      attributes,
      page = 1,
      perPage = 25,
      sortBy,
      sort = "createdAt:desc",
      order,
      status,
      search,
      include: includes,
      ...otherAttributes
    } = req.query;

    let whereConditions = {};
    if (search) {
      // whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });
    const { userId } = req.params;
    let loggedInUserId = null;

    if (req.headers.user) {
      loggedInUserId = JSON.parse(req.headers.user.id);
    } else if (req.headers.userid) {
      loggedInUserId = req.headers.userid;
    }
    // Find the user
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password", "genres"] },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const genres = await UserGenre.findAndCountAll({
      where: {
        userId,
      },
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const genresMeta = HelperService.paginationLink({
      total: genres.count,
      page,
      perPage,
    });

    const numberOfFollowers = await Follow.count({
      where: { followedId: userId },
    });

    let isFollowingArtist = false;

    if (loggedInUserId && loggedInUserId !== userId) {
      const following = await Follow.findOne({
        where: {
          followerId: loggedInUserId,
          followedId: userId,
        },
      });

      if (following) {
        isFollowingArtist = true;
      }
    }

    return res.status(200).send({
      success: true,
      data: {
        user,
        genresData: {
          genres: genres.rows,
          meta: genresMeta,
        },
        isFollowingArtist,
        numberOfFollowers,
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

exports.saveBankAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { bankName, bankAccountName, bankAccountNumber, swiftCode, bvn } =
      req.body;

    // Find the user
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Check if a bank account for the user already exists
    const existingBankAccount = await UserBankAccount.findOne({
      where: { userId },
    });

    if (existingBankAccount) {
      // Update the existing bank account
      await existingBankAccount.update({
        bankName,
        bankAccountName,
        bankAccountNumber,
        swiftCode,
        bvn,
      });

      return res.status(200).send({
        success: true,
        message: "Bank account updated successfully.",
      });
    } else {
      // Create a new bank account
      await UserBankAccount.create({
        userId,
        bankName,
        bankAccountName,
        bankAccountNumber,
        swiftCode,
        bvn,
      });

      return res.status(201).send({
        success: true,
        message: "Bank account created successfully.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const { followerId, followedId } = req.body;

    if (followerId === followedId) {
      return res
        .status(400)
        .send({ success: false, message: "You cannot follow yourself." });
    }

    const checkFollowIdsExist = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: [followerId, followedId],
        },
      },
    });

    if (checkFollowIdsExist.length !== 2) {
      return res.status(404).send({
        success: false,
        message: "One or both user IDs do not exist.",
      });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      return res.status(400).send({
        success: false,
        message: "You are already following this artiste.",
      });
    }

    // Create a new follow relationship
    await Follow.create({ followerId, followedId });
    return res
      .status(201)
      .send({ success: true, message: "Artiste followed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const { followerId, followedId } = req.body;

    const followRecord = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (!followRecord) {
      return res.status(400).json({
        success: false,
        message: "You are not following this artiste.",
      });
    }

    // Delete the follow relationship
    await followRecord.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Artiste unfollowed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const listFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.findAll({
      where: { followedId: userId },
      include: { model: User, as: "follower", attributes: ["id", "username"] },
    });

    return res.status(200).json(followers);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

const listFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.findAll({
      where: { followerId: userId },
      include: { model: User, as: "followed", attributes: ["id", "username"] },
    });

    return res.status(200).json(following);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
};
