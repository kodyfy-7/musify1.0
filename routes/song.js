const express = require("express");
const SongController = require("../app/controllers/SongController");
const {
  profileRequest,
  genreRequest,
  validate,
} = require("../app/services/Validation/Auth/AuthRequestValidation");
const {
  projectRequest,
  accountRequest,
  musicRequest,
  albumRequest,
  songRequest,
} = require("../app/services/Validation/ArtisteRequestValidation");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // , limits: { fileSize: 6 * 1024 * 1024 },
});

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/users/:userId/genre")
  .post(genreRequest(), validate, protect, SongController.saveGenre);

router
  .route("/users/:userId/albums")
  .post(albumRequest(), validate, protect, SongController.createAlbum);

router.route("/users/:userId/songs").post(
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "tracks", maxCount: 3 },
  ]),
  SongController.createSong
);

router
  .route("/songs/recently-added")
  .get(SongController.recentlyUploadedTracks);

router.route("/songs/streams").post(SongController.trackStream);

router
  .route("/songs/recently-played/:userId")
  .get(protect, SongController.getRecentlyPlayedSongs);

router.route("/artistes/popular").get(SongController.getPopularArtistes);

router.route("/songs/:songId/artistes/:artisteId").get(SongController.getASong);

router.route("/artistes/").get(SongController.artistes);

router.route("/artistes/:artisteId/songs").get(SongController.artisteSongs);

router.route("/artistes/:artisteId/singles").get(SongController.artisteSingles);

router.route("/artistes/:artisteId/albums").get(SongController.artisteAlbums);

router
  .route("/artistes/:artisteId/number-of-followers")
  .get(SongController.numberOfFollowers);

router.route("/show-love-categories").get(SongController.showLoveCategories);

router.route("/genres").get(SongController.genres);

router
  .route("/artistes/:userId/streams/chart")
  .get(protect, SongController.artisteStreamChart);

router
  .route("/users/:userId/playlists")
  .post(protect, SongController.createPlaylist);

module.exports = router;
