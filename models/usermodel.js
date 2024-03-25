const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require("crypto");
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name should be less than 30 words"],
    minLength: [3, "Name should be more than 3 words"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    maxLength: [30, "password should be less than 30 words"],
    minLength: [5, "password should be more than 3 words"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: {
      type: String,
      
    },
    url: {
      type: String,
  
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetpasswordtoken: String,
  resetpasswordexpire: Date,
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT token
userschema.methods.getJWTTOKEN = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
      {
    expiresIn:process.env.JWT_EXPIRES,
    }
  );
};

userschema.methods.getresetpasswordtoken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to userSchema
  this.resetpasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetpasswordexpire = Date.now() + process.env.RESET_PASSWORD_TOKEN_EXPIRE_IN_MIN * 60 * 1000;
  return resetToken;
};
//Comppare password : Lets check
userschema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", userschema);
