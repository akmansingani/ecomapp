const express = require("express");
const routes = express.Router();

const objProduct = require("../controllers/productController");
const objAuth = require("../controllers/authController");
const objUser = require("../controllers/userController");


routes.post(
  "/product/create/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objProduct.create
);

routes.get(
  "/product/details/:productId",
  objProduct.details
);

routes.delete(
  "/product/remove/:productId/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objProduct.remove
);

routes.put(
  "/product/update/:productId/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objAuth.isAdminRequired,
  objProduct.update
);

routes.get(
  "/product/list/",
  objProduct.list
);

routes.get(
  "/product/related/:productId",
  objProduct.relatedProducts
);

routes.get(
  "/product/categories/",
  objProduct.categoryList
);

routes.get(
  "/product/searchProducts/",
  objProduct.searchProducts
);

routes.post("/product/filterProducts/", objProduct.filterProducts);

routes.get(
  "/product/image/:productId",
  objProduct.productImage
);

routes.param("userId", objUser.getUserbyId);

routes.param("productId", objProduct.getProductById);

module.exports = routes;
