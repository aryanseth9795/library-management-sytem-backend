const express=require('express');
const { isauthenticateduser, authorizerole } = require("../middleware/auth");
const { registeruser,loginuser,forgotPassword, resetPassword, getuserprofiledetail, updatePassword, updateUserProfile, getallusers, getoneuser,deleteUser,updateUserRole  } = require('../Controllers/usercontroller');
const { singleupload } = require('../middleware/multer');
const router=express.Router();
router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isauthenticateduser,getuserprofiledetail);
router.route("/me/updateprofile").post(isauthenticateduser,singleupload,updateUserProfile);
router.route("/me/password/update").put(isauthenticateduser,updatePassword);
//admin
router.route("/admin/users").get(isauthenticateduser,authorizerole("admin"),getallusers);
router
  .route("/admin/user/:id")
  .get(isauthenticateduser, authorizerole("admin"), getoneuser)
  .put(isauthenticateduser, authorizerole("admin"), updateUserRole)
  .delete(isauthenticateduser, authorizerole("admin"),deleteUser);

module.exports=router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               