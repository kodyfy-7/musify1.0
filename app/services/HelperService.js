const crypto = require('crypto');
const moment = require("moment");
// const LoginLog = require('../../models/LoginLog');

// exports.generateNumericOtp = (length) => {
//   const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
//   const otp = randomBytes
//     .toString('hex')
//     .replace(/[^\d]/g, '') // Remove non-numeric characters
//     .slice(0, length);
//   return otp;
// };
exports.generateNumericOtp = () => {
  // const min = 100000;
  // const max = 999999;
  // const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  // return otp.toString(); // Convert to string if needed
  return crypto.randomInt(100000, 999999).toString();
};

exports.generateTag = (prefix, suffix) => {
  // Generate a random 6-character string and concatenate with the prefix and suffix
  let tag = `${prefix}${Math.random().toString(36).substr(2, 6).toUpperCase()}${suffix}`;
  return tag;
};

exports.calculateAge = (dateOfBirth) => {
  // Parse the date of birth using Moment.js
  const birthDate = moment(dateOfBirth);

  // Get the current date
  const now = moment();

  // Calculate the total number of days between the dates
  const daysDifference = now.diff(birthDate, "days");

  // Calculate the exact age in years (as a decimal)
  const exactAge = daysDifference / 365.25;

  // Format the age to one decimal place
  const age = parseFloat(exactAge.toFixed(1));

  return age;
};
// exports.createLoginLog = async (data) => {
//     await LoginLog.create(data);
//     return true;
// };

exports.pagination = ({ page = 1, per_page = 25 }) => {
  const offset = (page - 1) * per_page;
  const limit = per_page;

  return { offset, limit };
};

exports.paginationLink = ({ page = 1, per_page = 50, total }) => {
  // Prepare Paginationation Links
  const lastPage = Math.ceil(total / Number(per_page));

  let nextPage = Number(page) + 1;

  let prevPage = Number(page) - 1;
  const from = prevPage * Number(per_page) + 1;
  const to = Number(
    total < Number(per_page)
      ? total
      : prevPage * Number(per_page) + Number(per_page)
  );

  if (prevPage < 1) {
    prevPage = null;
  }
  if (nextPage > lastPage) {
    nextPage = null;
  }

  return {
    total,
    page,
    last_page: lastPage,
    next_page: nextPage,
    previous_page: prevPage,
    from,
    to,
    per_page
  };
};

exports.sortList = ({ sort, sortBy, order = "DESC" }) => {
  // Single column sorting
  if (sortBy) {
    return [[sortBy, order]];
  }

  // Multiple columns sorting
  if (sort) {
    return sort.split(",").map(item => item.split(":"));
  }

  // Default sorting
  return [];
};
