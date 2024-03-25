const Errorhandler = require("../utils/errorhandler");
const User = require("../models/usermodel");
const sendToken = require("../utils/jwttoken");
const catchasyncerror = require("../middleware/catchasyncerror");
const sendemail = require("../utils/sendmail.js");
const cloudinary = require("cloudinary");
const crypto=require("crypto");
//register a user
exports.registeruser = catchasyncerror(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 200, res, "Register Successfully");
});
//login user
exports.loginuser = catchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  //checking user given both email and password
  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email & Password ", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Errorhandler("Invalid Email or Password"), 401);
  }
  const ispasswordmatched = await user.comparePassword(password);

  if (!ispasswordmatched) {
    return next(new Errorhandler("Invalid Email or Password"), 401);
  }
  sendToken(user, 200, res, "Login Succesfully");
});



//Forget Password

exports.forgotPassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new Errorhandler("User Not Found", 404));
  }
  const resetoken =  await user.getresetpasswordtoken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${process.env.FRONTENDURL}/password/reset/${resetoken}`;
  const message = `LIBRARY MANAGEMENT SYSTEM-IIIT
  \n\n 
  THIS LINK WILL EXPIRE IN 15 MIN\n\nYour reset token is :-\n\n ${resetURL}
  \n\nIf You are not requested this email please ignore`;
  try {
    await sendemail({
      email: user.email,
      subject: "Libary Login Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${req.body.email}`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Errorhandler(error, 500));
  }
});

//reset password
exports.resetPassword = catchasyncerror(async (req, res, next) => {
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });
  if (!user) {
    next(new Errorhandler("Reset Token is invalid", 400));
  }
  if (req.body.password !== req.body.confirmpassword) {
    next(new Errorhandler("Password Does not match", 404));
  }
  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;
  await user.save();
  res.status(201).json({
    success:true,
    message:"Password Reset Successfully"
  })
});
// finding one user
exports.getuserprofiledetail = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const ispasswordmatched = await user.comparePassword(req.body.oldpassword);

  if (!ispasswordmatched) {
    return next(new Errorhandler("Wrong Password"), 401);
  }
  if (req.body.newpassword !== req.body.confirmpassword) {
    return next(new Errorhandler("New Password does not match"), 401);
  }
  user.password = req.body.newpassword;
  await user.save();
  sendToken("", 200, res,"Password Updated Successfully");
});

//update user profile
exports.updateUserProfile = catchasyncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
  };
   const userdetail = await User.findById(req.user.id);
  const imageId = userdetail.avatar.public_id;
  if (req.body.avatar !== imageId) {
    if(imageId){
      await cloudinary.v2.uploader.destroy(imageId);
    }
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Profile",
      crop: "scale",
    });
    
    newuserdata.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  if(!user){
    return next(new Errorhandler("Error in con",401))
  }
  res.status(200).json({
    user,
    success: true,
    message: "Profile Updated Successfully",
  });
});


// get all usrs --admin
exports.getallusers = catchasyncerror(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});
// get one usr --admin
exports.getoneuser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new Errorhandler("User not found", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchasyncerror(async (req, res, next) => {
 const user= await User.findByIdAndUpdate(req.params.id, {role:req.body.role}, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
if(!user){
  return next(new Errorhandler("Not found ",401))
}
  res.status(200).json({
    success: true,
    message:`Updated To ${req.body.role}`
  });
});

// Delete User --Admin
exports.deleteUser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
