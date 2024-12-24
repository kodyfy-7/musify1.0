const randomString = require("random-string");

const Utils = {};

Utils.generateCloudenlyID = () => {
  const suffix = randomString({
    length: 7,
    numeric: true,
    letters: false,
    special: false,
    exclude: ["a", "b", "1"]
  });
  return `C-${suffix}`;
};
Utils.generateOrgID = () => {
  return randomString({
    length: 12,
    numeric: true,
    letters: false,
    special: false,
    exclude: ["a", "b", "1"]
  });
};
Utils.randomCharacters = (
  length,
  numeric = true,
  letters = false,
  capitalization = true
) => {
  return randomString({
    length,
    numeric,
    letters,
    capitalization
  });
};
Utils.hashedCharacters = length => {
  return randomString({
    length,
    spec: true
  });
};

module.exports = Utils;
