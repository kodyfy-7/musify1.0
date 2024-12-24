const streamifier = require("streamifier");
const { uploader, config } = require("cloudinary").v2

config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "Please select a file" });
    }

    const file = req.file;

    const uploadOptions = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    const fileUpload = await new Promise((resolve, reject) => {
      const stream = uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const fileUrl = fileUpload.secure_url;

    return res.status(201).send({
      success: true,
      data: fileUrl,
      message: "File uploaded successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.uploadMusic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "Please select a music file" });
    }

    const file = req.file;

    const uploadOptions = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      resource_type: "video", // Cloudinary treats music as a "video" resource type
    };

    const fileUpload = await new Promise((resolve, reject) => {
      const stream = uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const fileUrl = fileUpload.secure_url;

    return res.status(201).send({
      success: true,
      data: fileUrl,
      message: "Music uploaded successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
