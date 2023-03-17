const express = require("express");

const Router = express.Router();
const { login, register } = require("../controllers/auth");

Router.route("/login").post(login);
Router.route("/register").post(register);

module.exports = Router;
