const multer = require("multer");
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml") ||
    file.mimetype.includes("image/jpeg") ||
    file.mimetype.includes("image/png") || 
    file.mimetype.includes("zip") ||
    file.mimetype.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") 
  
  ) {
    cb(null, true);
  } else {
    cb("Please upload a valid file.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./libraries/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;

