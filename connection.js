const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const Users = require("./models/users");
const seed = require("./seed");

let promise;
module.exports = {
  initialize: () => {
    if (promise) {
      return promise;
    } else {
      promise = sequelize
        .authenticate()
        .then((result) => {
          console.log(`SQLite successfully connected!`);
          return Users.sync();
        })
        .then((result) => {
          console.log(`Users table created`);
          return seed.load();
        })
        .then(() => {})
        .catch((error) => {
          console.error("Unable to connect to SQLite database:", error);
        });
      return promise;
    }
  },
};
