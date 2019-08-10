const express = require("express");
const routes = express.Router();

// controllers
const objAuth = require("../controllers/authController");
const objUser = require("../controllers/userController");
const objOrder = require("../controllers/orderController");

routes.post(
  "/order/create/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objUser.addUserHistory,
  objOrder.updateQuantity,
  objOrder.createOrder
);

routes.get(
  "/order/list/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objOrder.listOrder
);

routes.post(
  "/order/updatestatus/:userId/:orderId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objOrder.updateOrderStatus
);


routes.param("userId", objUser.getUserbyId);
routes.param("orderId", objOrder.getOrderbyId);

module.exports = routes;
