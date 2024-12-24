const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || '127.0.0.1', // Fallback to default if not provided
    port: process.env.EMAIL_PORT || 1025, // Default port 25
    secure: process.env.EMAIL_SECURE === 'true', // Convert to boolean
    auth: {
        user: process.env.EMAIL_USER, // Read from environment variables
        pass: process.env.EMAIL_PASS, // Read from environment variables
    },
    tls: {
        ciphers: 'SSLv3',
    },
});

const mailOptions = {
    from: '"Testassessify" <ayo@testassessify.com>'
};

module.exports = { transporter, mailOptions };