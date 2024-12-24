const express = require("express");
const ProjectController = require("../app/controllers/ProjectController");

const {
  projectRequest,
  validate,
} = require("../app/services/Validation/ArtisteRequestValidation");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/users/:userId/projects")
  .post(projectRequest(), validate, protect, ProjectController.saveProjectInfo);

router
  .route("/users/:userId/projects")
  .get(protect, ProjectController.getArtisteProjects);

module.exports = router;
