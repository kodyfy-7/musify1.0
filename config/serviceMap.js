module.exports = {
  external: {
    mauticClientId: process.env.MAUTIC_CLIENT_ID,
    mauticClientSecret: process.env.MAUTIC_CLIENT_SECRET,
    mauticApiUrl: process.env.MAUTIC_API_URL
  }
};
// module.exports = {
//   external: {
//     loremMailUrl: process.env.LOREM_MAIL_URL,
//     loremMailApiId: process.env.LOREM_MAIL_API_ID,
//     loremMailApiSecret: process.env.LOREM_MAIL_API_SECRET,
//     loremMailOrgId: process.env.LOREM_MAIL_ORG_ID,
//   }
// };