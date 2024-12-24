const jwt = require('jsonwebtoken');
// const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    try { 
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get User from the token
            // const user = await User.findOne({
            //     where: {
            //         id: decoded.id
            //     },
            //     attributes: ["id", "name", "email", "roleId", "organizationId"],
            //     raw: true,
            // });

            // if (!user) {
            //     return res.status(401).send({
            //         message: 'Unauthorized'
            //     });
            // }

            // Attach user object to request for further middleware/routes to use
            const user = {
                id: decoded.id, // Include other properties if needed
            };

            // Attach the user object to both `req.user` and headers
            req.headers.user = JSON.stringify(user);
            next();
        } else {
            return res.status(400).send({
                message: 'Not authorized, no authorization token'
            });
        }
    } catch (error) {
        // Log the error
        console.error('JWT verification error:', error.message);

        // Handle different JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                message: 'Token expired'
            });
        } else {
            return res.status(500).send({
                message: 'Internal Server Error'
            });
        }
    }
};

module.exports = { protect };
