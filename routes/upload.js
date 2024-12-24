const express = require("express");
const UploadController = require("../app/controllers/UploadController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/uploads/images")
  .post(protect, upload.single("file"), UploadController.uploadImage);

router
  .route("/uploads/music")
  .post(protect, upload.single("file"), UploadController.uploadMusic);

module.exports = router;
