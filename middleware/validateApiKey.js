// // const jwt = require('jsonwebtoken')
// // const asyncHandler = require('express-async-handler')
// const Application = require("../models/Application");

// // const validateApiKey =/* asyncHandler(*/async (req, res, next) =>  {
// //     const apiKey = req.headers.authorization;
// //     // Check if apiKey is valid (e.g. in a database)
// //     const application = await Application.findOne({ where: {applicationKey: apiKey}});
// //     if (!application) {
// //         return res.status(401).send("Unauthorized");
// //     } 
// //     next();
    
// // }/*)*/ 
// const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// const validateApiKey = async (req, res, next) =>  {
//     try {
//       const apiKey = req.headers.authorization;
//       if (!apiKey || !UUID_PATTERN.test(apiKey)) {
//         return res.status(401).send("Unauthorized");
//       }
//       const application = await Application.findOne({ where: {applicationKey: apiKey}});
//       if (!application) {
//         res.status(401).send("Unauthorized");
//       } else {
//         next();
//       }
//     } catch (error) {
      console.error(error);
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }

// module.exports = { validateApiKey }
