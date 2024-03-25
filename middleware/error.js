const Errorhandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  //MongoDb Cast error
  if (err.name === "CastError") {
    const message = `Resource Not Found invalid:${err.path}`;
    err = new Errorhandler(message, 400);
  }
  //Mongoose Dublicate Error
  if (err.name === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} Entered`;
    err = new Errorhandler(message, 400);
  }
  //JWT Token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json WebToken is invalid, Please Try Again later`;
    err = new Errorhandler(message, 400);
  }
  //JWT Token expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json WebToken is invalid, Please Try Again later`;
    err = new Errorhandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
