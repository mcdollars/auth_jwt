const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const Users = require("../models/users");
const connection = require("../connection");

const app = require("../index");

chai.use(chaiHttp);

const port = process.env.PORT || 8000;
const server = app.listen(port);

let responseData, responseKeys, newToken;

before(async () => {
  await connection.initialize();
});

describe("JWT Auth APIs", () => {
  describe("Tests for Create JWT", () => {
    it("#1 - should return JWT for the user Brady", async () => {
      const requestBody = {
        username: "BradyMoss",
        password: "loremIpsum",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      responseData = response.body;
      responseKeys = Object.keys(responseData);
      expect(response.status).to.be.equal(200);
      expect(responseKeys.length).to.be.equal(1);
      expect(responseKeys[0]).to.be.equal("token");
      expect(typeof responseData.token).to.be.equal("string");
    });
    it("#2 - should save JWT of the user in users table", async () => {
      const result = await Users.findByPk(1, { raw: true });

      expect(result.token).to.be.equal(responseData.token);
    });
    it("#3 - should return new JWT after login API again", async () => {
      const oldToken = responseData.token;
      const requestBody = {
        username: "BradyMoss",
        password: "loremIpsum",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      newToken = response.body.token;

      expect(response.status).to.be.equal(200);
      expect(response.body.token).to.be.not.equal(oldToken);
    });
    it("#4 - should return 401 in case of incorrect username", async () => {
      const requestBody = {
        username: "wrongUsername",
        password: "loremIpsum",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
    it("#5 - should return 401 in case of incorrect password", async () => {
      const requestBody = {
        username: "BradyMoss",
        password: "wrongPassword",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
    it("#6 - should return 401 in case of empty username", async () => {
      const requestBody = {
        username: "",
        password: "wrongPassword",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
    it("#7 - should return 401 in case of empty password", async () => {
      const requestBody = {
        username: "BradyMoss",
        password: "",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
    it("#8 - should return 401 in case of username not present", async () => {
      const requestBody = {
        password: "loremIpsum",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
    it("#9 - should return 401 in case of password not present", async () => {
      const requestBody = {
        username: "BradyMoss",
      };
      const response = await chai
        .request(server)
        .post("/login")
        .send(requestBody);
      expect(response.status).to.be.equal(401);
    });
  });
  describe("Tests for Validate JWT", () => {
    it("#1 - should return username of Brady from the JWT", async () => {
      const requestBody = {
        token: newToken,
      };
      const response = await chai
        .request(server)
        .post("/validate")
        .send(requestBody);

      expect(response.status).to.be.equal(200);
      expect(response.body.username).to.be.equal("BradyMoss");
    });
    it("#2 - should send 401 in case of old JWT", async () => {
      const requestBody = {
        token: responseData.token,
      };
      const response = await chai
        .request(server)
        .post("/validate")
        .send(requestBody);

      expect(response.status).to.be.equal(401);
    });
    it("#3 - should return 401 in case of invalid JWT", async () => {
      const requestBody = {
        token: "someRandomJWT",
      };
      const response = await chai
        .request(server)
        .post("/validate")
        .send(requestBody);

      expect(response.status).to.be.equal(401);
    });
  });
});
