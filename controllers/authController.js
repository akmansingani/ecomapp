const User = require("../models/userModel");
const { errorHandler } = require("../handlers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup =  async (req, res) => {
  
  const user = new User(req.body);

  await user.save((err, user) => {
    if (err) {

      let customError = errorHandler(err);

      if(customError)
      {
         customError = customError.substring(customError.lastIndexOf(":")+2,customError.length-1);
         customError = customError.charAt(0).toUpperCase() + customError.slice(1);
      }

      return res.status(400).json({
        error: customError
      });
    }

    console.log("error",err);

    return res.status(200).json({
      name: user.name,
      email: user.email,
      about: user.about,
      role: user.role,
      history: user.history
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!user || err) {
      return res.status(400).json({
        error: "User does not exists!"
      });
    }

    // check password
    if (!user.authenticateUser(password)) {
      return res.status(400).json({
        error: "Email and password does not match!"
      });
    }

    // on success generate login token and set cookie
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWTKEY
    );

    res.cookie("uToken", token, { maxAge: 5 * 60 * 60 * 1000 });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("uToken");
  res.json({ message: "User has been successfully sign out!" });
};


// ********************** Middle ware *******************************

exports.requireSign =  expressJwt({
  secret: process.env.JWTKEY,
  userProperty:"auth"
});

exports.requireSignError = (err, req, res, next) => {
  
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error : "Invalid User Token!"
    });
  }
};

exports.isUserAuthenicate = (req, res, next) => {
 
  let user = req.user && req.auth && req.user._id == req.auth._id;

  if(!user)
  {
     return res.status(401).json({
       error: "User does not exists!"
     });
  }
   
  next();
};

exports.isAdminRequired = (req, res, next) => {

  if (req.user.role === 0) {

    return res.status(401).json({
      error: "Access denied!"
    });

  }

  next();

};

// ********************** Middle ware *******************************