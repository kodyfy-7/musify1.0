const express = require("express");
const UserController = require("../app/controllers/UserController");
const {
  profileRequest,
  validate,
} = require("../app/services/Validation/Auth/AuthRequestValidation");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage
  // , limits: { fileSize: 6 * 1024 * 1024 }, 
});
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/users/:userId/profile")
  .post(profileRequest(), validate, protect, UserController.saveProfile);

router.route("/users/:userId/images").post(
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profileHeader", maxCount: 1 },
  ]),
  UserController.saveImages
);

router.route("/users/follow").post(protect, UserController.followUser);

router.route("/users/unfollow").post(protect, UserController.unfollowUser);

router
  .route("/artistes/:userId/profile")
  .get(UserController.getArtisteProfile);

module.exports = router;
