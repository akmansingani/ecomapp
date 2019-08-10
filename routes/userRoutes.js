const express = require('express');
const routes = express.Router();

// controllers
const objUser = require('../controllers/userController');
const objAuth = require("../controllers/authController");

/*routes.get(
  "/details/:userId",         
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  (req, res) => {
    res.json({
      user: req.auth
    });
  }
);*/

routes.get(
  "/user/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objUser.getDetails  
);

routes.post(
  "/user/update/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objUser.updateDetails
);

routes.get(
  "/user/order/history/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objUser.orderHistory
);


routes.param("userId",objUser.getUserbyId);

module.exports = routes;