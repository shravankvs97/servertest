const jwt = require("jsonwebtoken");

module.exports = {
  checkDuplicateUser: (arr, email) => {
    console.log("ss");
    console.log("ll");

    let obj = arr.filter(function (user) {
      if (user.email === email) {
        return user;
      }
    });

    if (obj.length === 0) {
      return true;
    } else {
      return false;
    }
  },
  createToken: (payload) => {
    return jwt.sign(payload, "12345");
  },
  checkPassword: (arr, password) => {
    let obj = arr.filter(function (user) {
      if (user.password === password) {
        return user;
      }
    });
    if (obj.length == 0) {
      return false;
    }
    return true;
  },
};
