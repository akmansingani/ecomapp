const express = require("express");
const routes = express.Router();

const objCategory = require("../controllers/categoryController");
const objAuth = require("../controllers/authController");
const objUser = require("../controllers/userController");


routes.post(
  "/category/create/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objCategory.create
);

routes.get(
  "/category/details/:categoryId",
   objCategory.details
);

routes.delete(
  "/category/remove/:categoryId/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objCategory.remove
);

routes.put(
  "/category/update/:categoryId/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objCategory.update
);

routes.get(
  "/category/list/",
  objCategory.list
);


routes.param("userId", objUser.getUserbyId);

routes.param("categoryId", objCategory.getCategoryById);

module.exports = routes;
