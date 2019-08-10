const {Order,Cart} = require("../models/orderModel");
const Product = require("../models/productModel");
const { errorHandler } = require("../handlers/dbErrorHandler");

require("dotenv").config();

exports.createOrder = (req, res) => {
   
  // console.log("create order....", req.body.orders);

   req.body.orders.user = req.user;

   const order = new Order(req.body.orders);
   order.save((err,result) => {

      if (err && !result) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.json(result);

   });
 
};

exports.updateQuantity = (req, res,next) => {
 
   let order = req.body.orders;
   let query = order.products.map((item) => {

      return {
         updateOne : {
            filter : {_id:item._id},
            update : {$inc : {quantity : -item.count,sold: +item.count}}
         }
      }

   });

   Product.bulkWrite(query, {}, (err, result) => {

      if (err) {
         return res.status(400).json({
            error: "Error updating quantity"
         });
      }

      next();

   });

  
};


exports.listOrder = (req, res) => {

   Order.find()
   .populate('user',"_id name email address")
   .sort("createdAt : -1")
   .exec((err,result) => {

        if (err && !result) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }

        res.json(result);

   });


};

exports.getOrderbyId = async (req, res, next, orderId) => {
  await Order.findById(orderId)
   .populate('products.product','name price')
    .exec((err, result) => {
      if (err || !result) {
        return res.status(400).json({
          error: "Order not found"
        });
      }

      req.order = result;
      next();
    });
};

exports.updateOrderStatus = (req, res) => {
  
   //console.log("update order status", req.body);

   Order.updateOne(
     { _id: req.body.orderId },
     { $set: { status: req.body.status } })
     .exec((err, result) => {
       if (err || !result) {
         return res.status(400).json({
           error: errorHandler(err)
         });
       }

       res.json({ orderId: req.body.orderId, status: req.body.status });
     }
   );

 
  
};

