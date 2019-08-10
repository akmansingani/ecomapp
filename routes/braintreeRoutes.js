const express = require("express");
const routes = express.Router();

// controllers
const objAuth = require("../controllers/authController");
const objUser = require("../controllers/userController");
const objBt = require("../controllers/braintreeController");

routes.get(
  "/bt/getToken/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objBt.generateToken
);

routes.post(
  "/bt/purchase/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objBt.purchasePayment
);

routes.param("userId", objUser.getUserbyId);

module.exports = routes;