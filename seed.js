const sequelize_fixtures = require("sequelize-fixtures");
const Users = require("./models/users");

module.exports = {
  load: () => {
    return sequelize_fixtures
      .loadFile("fixtures/*.json", { users: Users })
      .then(() => {
        console.log("Loaded seed data");
      })
      .catch((err) => {
        console.log("Error seeding data", err);
      });
  },
};
