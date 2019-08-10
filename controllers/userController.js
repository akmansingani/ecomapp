const User =  require('../models/userModel');
const _ = require("lodash");
const { Order, Cart } = require("../models/orderModel");

exports.getUserbyId = async (req,res,next,userId) => {
 
    await User.findById(userId)
      .select({
        en_password: false,
        saltKey: false
      })
      .exec((err, user) => {

        if (err || !user) {
          return res.status(400).json({
            error: "User not found"
          });
        }

        req.user = user;
        next();
        
      });
    
    
  
};

exports.getDetails = (req, res ) => {

  req.user.history = undefined;

  return res.json(req.user);

};


exports.updateDetails = (req, res) => {

  let objUser = req.user;
  objUser = _.extend(objUser, req.body);

  objUser.save((err, user) => {
    if (err && !result) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    user.en_password = undefined;
    user.saltKey = undefined;
    user.history = undefined;
    req.user = user;

    return res.json(user);
  });

};

exports.addUserHistory = (req, res,next) => {

    let history =[];

    let order = req.body.orders;
    order.products.forEach(item => {
      history.push({
        id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.count,
        transactionid: order.transactionid,
        amount: order.amount
      });
    });

      User.findOneAndUpdate({_id : req.user._id},{$push : {history : history}},{new : true}, (err,result) => {

        if(err)
        {
          return res.status(400).json({
            error:"Error updating user purchase history"
          })
        }

        next();

      });
    


};


exports.orderHistory = (req, res) => {
  
   //res.json(req.user.history);

   Order.find({user : req.user._id})
   .select("products")
   .sort("createdAt : -1")
   .exec((err,result) => {
     if(err)
     {
       return res.status(400).json({
         error: "Error getting user purchase history"
       });
     }

     res.json(result);

   }) 

};


