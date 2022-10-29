// helper function used in class--generates a random string of letters and numbers
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);