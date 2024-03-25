const Errorhandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const catchasyncerror = require("./catchasyncerror");

exports.isauthenticateduser = catchasyncerror(async (req, res, next) => {
  const  token  = req.header('token');
  let decodeddata=null;
  if (!token) {
    return next(new Errorhandler("Please Login First", 401));
  }
  jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
      return next(new Errorhandler(err.message, 400));
    }
     decodeddata=decoded.id
  });
 
  req.user = await User.findById(decodeddata);
  next();
});

exports.authorizerole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Errorhandler("You Are not authorize to access", 403));
    }
    next();
  };
};
