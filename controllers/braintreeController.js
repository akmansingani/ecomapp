const User = require("../models/userModel");
const braintree = require('braintree');
require("dotenv").config();


const btGateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
  merchantId: process.env.BT_MERCHANT_ID
});

exports.generateToken = (req, res) => {

 // console.log("generating token....");

   btGateway.clientToken.generate({},
     function(err, response) {
         if(err){
            return res.status(500).send(err);
         }
         else
         {
            return res.status(200).send(response);
         }
     }
   );
  
};

exports.purchasePayment = (req, res) => {
 
  let nonce = req.body.paymentMethodNonce;
  let amount = req.body.amount;

  console.log("purchase ",nonce,amount);

  let trans = btGateway.transaction.sale(
    {
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    },
    function(err, response) {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.send(response);
        }
    }
  );

  
};
