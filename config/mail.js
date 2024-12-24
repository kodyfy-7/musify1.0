const Mailgen = require('mailgen');

const mailGenerator = new Mailgen({
    theme: 'default', // Choose a theme: 'default', 'salted', or 'cerberus'
    product: {
        name: 'Testassessify',
        link: 'https://testassessify.com',
        logo: 'https://res.cloudinary.com/uche-9ijakids/image/upload/v1700132452/logo_mwfbh8.png' // Optional
    }
});

module.exports = mailGenerator;
