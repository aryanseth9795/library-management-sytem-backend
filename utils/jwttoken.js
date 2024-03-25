const sendToken = (user, statuscode,res,mess) => {
  const token = user.getJWTTOKEN();
  res.status(statuscode).json({
    success: true,
   message:mess,
    user,
    token,
  });
};
module.exports = sendToken;
