const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../database/PostgresDb");
const streamifier = require("streamifier");
const { uploader, config } = require("cloudinary").v2;
const User = require("../../models/User");
const UserSong = require("../../models/UserSong");
const HelperService = require("../services/HelperService");
const Stream = require("../../models/Stream");
const UserProject = require("../../models/UserProject");
const Role = require("../../models/Role");
const UserAlbum = require("../../models/UserAlbum");
const Follow = require("../../models/Follow");
const ShowLoveCategory = require("../../models/ShowLoveCategory");
const Genre = require("../../models/Genre");
const UserGenre = require("../../models/UserGenre");
const UserPlaylist = require("../../models/UserPlaylist");
const UserPlaylistSong = require("../../models/UserPlaylistSong");

config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.saveGenre = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { genreIds } = req.body;

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
    await UserGenre.destroy({
      where: {
        userId,
      },
    });
    if (Array.isArray(genreIds) && genreIds.length > 0) {
      const userGenres = genreIds.map((genreId) => ({
        userId,
        genreId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await UserGenre.bulkCreate(userGenres, { ignoreDuplicates: true });
    }

    return res.status(200).send({
      success: true,
      message: "Genre saved successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.createAlbum = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description, isPrivate, coverImage } = req.body;

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

    const album = await UserAlbum.create({
      userId,
      title,
      description,
      isPrivate,
      coverImage,
    });

    return res.status(201).send({
      success: true,
      message: "Album created successfully.",
      data: album,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.createSong = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description, isPrivate, isAlbum, allowInvestment, fundingGoal, fundingReason } = req.body;
    const allowInvestmentBoolean = allowInvestment === "true";

    // Validate tracks (req.files.tracks is now an array of files)
    const tracks = req.files.tracks;
    if (!tracks || tracks.length < 1) {
      return res
        .status(400)
        .send({ success: false, message: "At least one track is required." });
    }

    if (tracks.length > 3) {
      return res
        .status(400)
        .send({ success: false, message: "A maximum of 3 tracks is allowed." });
    }

    // Ensure each track has a title (we will assume track titles are sent in the form data)
    for (const track of tracks) {
      if (!track.originalname) {
        return res.status(400).send({
          success: false,
          message: "Each track must have a title and a file path.",
        });
      }
    }

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

    // Ensure cover image is provided
    if (
      !req.files ||
      !req.files.coverImage ||
      req.files.coverImage.length === 0
    ) {
      return res.status(422).send({
        success: false,
        message: "Please ensure a cover image is selected.",
      });
    }

    // Process cover image upload
    const coverImage = req.files.coverImage[0];
    const coverImageUpload = await uploadFile(coverImage);
    const coverImageUrl = coverImageUpload.secure_url;

    // Prepare song data for bulk insert
    const songData = [];
    let songAllowInvestment = allowInvestmentBoolean;
    let songFundingGoal = parseFloat(fundingGoal) || null;
    let songFundingReason = fundingReason;
    for (const track of tracks) {
      // Process track file upload
      const uploadOptions = {
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: "video",
      };

      const fileUpload = await new Promise((resolve, reject) => {
        const stream = uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(track.buffer).pipe(stream);
      });

      const filePathUrl = fileUpload.secure_url;

      let cleanedTitle = title;

      if (isAlbum === "true" || isAlbum === true) {
        cleanedTitle = track.originalname
          .replace(/\.[^/.]+$/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

          songAllowInvestment = false;
          songFundingGoal = null;
          songFundingReason = null;
      }

      songData.push({
        userId,
        userAlbumId: null,
        title: cleanedTitle,
        description: description || "",
        coverImage: coverImageUrl,
        filePath: filePathUrl,
        isPrivate: isPrivate || false,
        allowInvestment: songAllowInvestment,
        fundingGoal: songFundingGoal,
        fundingReason: songFundingReason,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    let albumId = null;

    if (isAlbum === "true" || isAlbum === true) {
      const album = await UserAlbum.create({
        userId,
        title,
        description,
        coverImage: coverImageUrl,
        allowInvestment: allowInvestmentBoolean,
        fundingGoal: parseFloat(fundingGoal) || null,
        fundingReason
      });

      songData.forEach((song) => {
        song.userAlbumId = album.id;
      });
    }
    
    await UserSong.bulkCreate(songData);

    return res.status(201).send({
      success: true,
      message: "Tracks uploaded successfully.",
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

exports.genres = async (req, res, next) => {
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
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const genres = await Genre.findAndCountAll({
      where: { ...whereConditions },
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: genres.count,
      page,
      perPage,
    });

    return res.status(200).send({ success: true, data: genres.rows, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.showLoveCategories = async (req, res, next) => {
  try {
    const showLoveCategories = await ShowLoveCategory.findAll();

    return res.status(200).send({ success: true, data: showLoveCategories });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.recentlyUploadedTracks = async (req, res, next) => {
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
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const recentlyAdded = await UserSong.findAndCountAll({
      where: { ...whereConditions },
      include: [
        {
          model: User,
          as: "artiste",
          attributes: ["id", "name", "username"],
        },
        {
          model: UserAlbum,
          as: "album",
        },
      ],
      attributes: ["id", "title", "coverImage", "filePath"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: recentlyAdded.count,
      page,
      perPage,
    });
    return res
      .status(200)
      .send({ success: true, data: recentlyAdded.rows, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.trackStream = async (req, res) => {
  try {
    const { songId, userId } = req.body;
    // Validate song existence
    const song = await UserSong.findByPk(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Record the stream
    await Stream.create({
      userSongId: songId,
      userId,
      streamedAt: new Date(),
    });

    return res.status(201).json({
      message: "Stream recorded successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRecentlyPlayedSongs = async (req, res) => {
  try {
    const { userId } = req.params;

    const subQuery = Stream.findAll({
      attributes: [
        "userSongId",
        [Sequelize.fn("MAX", Sequelize.col("streamedAt")), "latestStream"],
      ],
      where: { userId },
      group: ["userSongId"],
      order: [[Sequelize.fn("MAX", Sequelize.col("streamedAt")), "DESC"]],
      limit: 10,
      raw: true,
    });

    // Use the subquery to get unique songs with the latest details
    const recentlyPlayedSongIds = await subQuery;

    const userSongIds = recentlyPlayedSongIds.map(
      (record) => record.userSongId
    );

    // Fetch full details of the unique songs
    const recentlyPlayedSongs = await UserSong.findAll({
      where: {
        id: {
          [Op.in]: userSongIds,
        },
      },
      attributes: ["id", "title"],
      include: [
        {
          model: User,
          as: "artiste",
          attributes: ["id", "name", "username"],
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: recentlyPlayedSongs,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getPopularArtistes = async (req, res) => {
  try {
    const subQuery = await Stream.findAll({
      attributes: [
        [Sequelize.col("song.userId"), "userId"],
        [Sequelize.fn("COUNT", Sequelize.col("streamedAt")), "totalStreams"],
      ],
      include: [
        {
          model: UserSong,
          as: "song",
          attributes: [],
        },
      ],
      group: ["song.userId"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("streamedAt")), "DESC"]],
      limit: 10,
      raw: true,
    });

    const artistIds = subQuery.map((record) => record.userId);

    const popularArtistes = await User.findAll({
      where: {
        id: {
          [Op.in]: artistIds,
        },
      },
      attributes: ["id", "name", "username", "profileImage"],
    });

    const response = popularArtistes.map((artist) => {
      const artistData = subQuery.find((item) => item.userId === artist.id);
      return {
        id: artist.id,
        name: artist.name,
        username: artist.username,
        profileImage: artist.profileImage,
        totalStreams: artistData ? artistData.totalStreams : 0,
      };
    });

    return res.status(200).send({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getASong = async (req, res) => {
  try {
    const { songId, artisteId } = req.params;

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

    const song = await UserSong.findOne({
      where: {
        id: songId,
        userId: artisteId,
      },
    });
    if (!song) {
      return res.status(404).send({ message: "Song not found." });
    }

    const project = await UserProject.findOne({
      where: {
        userId: artisteId,
      },
    });

    if (project) {
      project.progress = "pending";
    }

    let whereConditions = { userId: artisteId };
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });
    const otherSongsByAritiste = await UserSong.findAndCountAll({
      where: { ...whereConditions },
      attributes: [
        "id",
        "title",
        "coverImage",
        "filePath",
        [Sequelize.fn("COUNT", Sequelize.col("streams.id")), "streamCount"],
      ],
      include: [
        {
          model: Stream,
          as: "streams",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["user_songs.id", "streams.id"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: otherSongsByAritiste.count.length, // Use length for count after grouping
      page,
      perPage,
    });

    return res.status(200).send({
      success: true,
      data: {
        song,
        otherSong: { otherSongsByArtistes: otherSongsByAritiste.rows, meta },
        project,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artistes = async (req, res, next) => {
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
    let whereConditions = { username: { [Op.ne]: null } };
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const role = await Role.findOne({
      where: {
        slug: "artiste",
      },
    });

    if (!role) {
      return res.status(404).send({ message: "no role found" });
    }

    const paginate = HelperService.pagination({ page, perPage });

    const artistes = await User.findAndCountAll({
      where: { ...whereConditions },
      attributes: ["id", "name", "profileImage", "username"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: artistes.count,
      page,
      perPage,
    });
    return res.status(200).send({ success: true, data: artistes.rows, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// exports.artisteSongs = async (req, res, next) => {
//   try {
//     const {
//       attributes,
//       page = 1,
//       perPage = 25,
//       sortBy,
//       sort = "createdAt:desc",
//       order,
//       status,
//       search,
//       include: includes,
//       ...otherAttributes
//     } = req.query;
//     const { artisteId } = req.params;

//     let whereConditions = { userId: artisteId };
//     if (search) {
//       whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
//     }

//     const paginate = HelperService.pagination({ page, perPage });

//     const allSongs = await UserSong.findAndCountAll({
//       where: { ...whereConditions },
//       attributes: [
//         "id",
//         "title",
//         "description",
//         "coverImage",
//         "filePath",
//         [Sequelize.fn("COUNT", Sequelize.col("streams.id")), "streamCount"],
//       ],
//       include: [
//         {
//           model: Stream,
//           as: "streams",
//           attributes: [],
//           duplicating: false,
//         },
//       ],
//       group: ["user_songs.id", "streams.id"],
//       order: HelperService.sortList({ sortBy, order, sort }),
//       ...paginate,
//     });

//     const meta = HelperService.paginationLink({
//       total: allSongs.count,
//       page,
//       perPage,
//     });

//     const songs = await Promise.all(
//       allSongs.rows.map(async (song) => {
        
//         // done to maintain same structure with albums
//         return {
//           id: song.id,
//           title: song.title,
//           description: song.description,
//           coverImage: song.coverImage,
//           createdAt: song.createdAt,
//           streamCount: song.streamCount,
//           updatedAt: song.updatedAt,
//           songs: [
//             {
//               id: song.id,
//               title: song.title,
//               description: song.description,
//               filePath: song.filePath,
//               coverImage: song.coverImage,
//               userAlbumId: song.userAlbumId,
//               createdAt: song.createdAt,
//             }
//           ]
//         };
//       })
//     );
//     return res.status(200).send({ success: true, data: songs, meta });
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.artisteSongs = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      sortBy = "streamCount", // Default sort by streamCount
      order = "desc", // Default order: highest to lowest
      search,
    } = req.query;
    const { artisteId } = req.params;

    // Define initial where conditions
    let whereConditions = { userId: artisteId };

    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    // Pagination options
    const paginate = HelperService.pagination({ page, perPage });

    // Fetch songs with stream count and ordering
    const allSongs = await UserSong.findAndCountAll({
      where: { ...whereConditions },
      attributes: [
        "id",
        "title",
        "description",
        "coverImage",
        "filePath",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("streams.id")), "streamCount"], // Calculate stream count
      ],
      include: [
        {
          model: Stream,
          as: "streams",
          attributes: [],
          duplicating: false, // Prevent duplication of results
        },
      ],
      group: ["user_songs.id"], // Group by the song ID
      order: [
        [Sequelize.literal(`"streamCount"`), order], // Dynamically sort by streamCount
      ],
      ...paginate, // Apply pagination
    });

    // Meta data for pagination links
    const meta = HelperService.paginationLink({
      total: allSongs.count.length,
      page,
      perPage,
    });

    // Format the response structure
    const songs = allSongs.rows.map((song) => ({
      id: song.id,
      title: song.title,
      description: song.description,
      coverImage: song.coverImage,
      filePath: song.filePath,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      songs: [
        {
          id: song.id,
          title: song.title,
          description: song.description,
          filePath: song.filePath,
          coverImage: song.coverImage,
          userAlbumId: song.userAlbumId,
          streamCount: song.get("streamCount"), // Use Sequelize's computed value
          createdAt: song.createdAt,
        },
      ],
    }));

    // Send successful response
    return res.status(200).send({ success: true, data: songs, meta });
  } catch (error) {
    console.error(error);

    // Send error response
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


exports.artisteSingles = async (req, res, next) => {
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
    const { artisteId } = req.params;

    let whereConditions = { userId: artisteId, userAlbumId: null };
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const allSongs = await UserSong.findAndCountAll({
      where: { ...whereConditions },
      attributes: [
        "id",
        "title",
        "description",
        "coverImage",
        "filePath",
        [Sequelize.fn("COUNT", Sequelize.col("streams.id")), "streamCount"],
      ],
      include: [
        {
          model: Stream,
          as: "streams",
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["user_songs.id", "streams.id"],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: allSongs.count,
      page,
      perPage,
    });

    const songs = await Promise.all(
      allSongs.rows.map(async (song) => {
        
        // done to maintain same structure with albums
        return {
          id: song.id,
          title: song.title,
          description: song.description,
          coverImage: song.coverImage,
          createdAt: song.createdAt,
          streamCount: song.streamCount,
          updatedAt: song.updatedAt,
          songs: [
            {
              id: song.id,
              title: song.title,
              description: song.description,
              filePath: song.filePath,
              coverImage: song.coverImage,
              userAlbumId: song.userAlbumId,
              createdAt: song.createdAt,
            }
          ]
        };
      })
    );
    return res.status(200).send({ success: true, data: songs, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.artisteAlbums = async (req, res, next) => {
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
    const { artisteId } = req.params;

    let whereConditions = { userId: artisteId };
    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const paginate = HelperService.pagination({ page, perPage });

    const albums = await UserAlbum.findAndCountAll({
      where: { ...whereConditions },
      include: [
        {
          model: UserSong,
          as: "songs",
        },
      ],
      order: HelperService.sortList({ sortBy, order, sort }),
      ...paginate,
    });

    const meta = HelperService.paginationLink({
      total: albums.count,
      page,
      perPage,
    });
    return res.status(200).send({ success: true, data: albums.rows, meta });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.numberOfFollowers = async (req, res, next) => {
  try {
    const { artisteId } = req.params;

    const followers = await Follow.count({
      where: { followedId: artisteId },
    });

    return res
      .status(200)
      .send({ success: true, numberOfFollowers: followers });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


exports.artisteStreamChart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    const streams = await Stream.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      attributes: [
        [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalStreams"],
      ],
      group: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`)],
      order: [Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") ASC`)],
    });

    const monthlyStreams = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalStreams: 0,
    }));

    streams.forEach((stream) => {
      const month = parseInt(stream.dataValues.month, 10);
      const totalStreams = parseInt(stream.dataValues.totalStreams, 10);
      monthlyStreams[month - 1].totalStreams = totalStreams;
    });

    return res.send({ data: monthlyStreams });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.createPlaylist = async (req, res, next) => {
  await sequelize.transaction(async (t) => {
    try {
      const { title, songIds } = req.body;
      const { userId } = req.params;

      const playlist = await UserPlaylist.create({
        userId,
        title
      }, { transaction: t });

      const playlistSongs = songIds.map((songId) => ({
        userPlaylistId: playlist.id,
        songId,
      }));
  
      // Perform bulk insert
      await UserPlaylistSong.bulkCreate(playlistSongs, { transaction: t });
      return res.status(200).send({ success: true, message: "Playlist created successfully" });
    } catch (error) {
      console.error(error);
      t.rollback();
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
};