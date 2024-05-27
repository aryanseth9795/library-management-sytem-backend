const Borrow = require("../models/book_borrow_model");
const catchasyncerror = require("../middleware/catchasyncerror");
const Book = require("../models/booksmodels");
const Errorhandler = require("../utils/errorhandler");


//<=----------------User Panel--------->

// get logged in user  borrow
exports.myborrow = catchasyncerror(async (req, res, next) => {
  const { value } = req.body;
  const borrow = await Borrow.find({
    user: req.user._id,
    borrowStatus: `${value}`,
  });
  if (!borrow) {
    next(new Errorhandler("No Borrowed", 401));
  }
  res.status(200).json({
    success: true,
    borrow,
  });
});
//New Request
exports.newborrow = catchasyncerror(async (req, res, next) => {
  const { book_id } = req.body;
  const book = await Book.findById({ _id: book_id });
  const borrow = await Borrow.create({
    bookItems: book,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Request Placed Successfully",
  });
});



exports.newReturn = catchasyncerror(async (req, res, next) => {
  const { id } = req.body;
  const borrow=await Borrow.findById(id);
 if(!borrow){
  return next( new Errorhandler("No Borrow Find ",401))
 }
 borrow.borrowStatus="ReturnR";
await borrow.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
    message: "Return Request Placed Successfully",
  });
});

// <---------------------ADMIN PANEL-------------->

// get all borrow -- Admin
exports.getborrowreq = catchasyncerror(async (req, res, next) => {
  const { value } = req.body;
  const borrow = await Borrow.find({ borrowStatus: `${value}` });
  if (!borrow) {
    next(new Errorhandler("No Borrowed", 401));
  }
  res.status(200).json({
    success: true,
    borrow,
  });
});
exports.getborrowed = catchasyncerror(async (req, res, next) => {
  const borrow = await Borrow.find({ borrowStatus: "Borrowed" });
  res.status(200).json({
    success: true,
    borrow,
  });
});



// get detail borrow for updating /approving
exports.getSingleborrowing = catchasyncerror(async (req, res, next) => {
  const borrow = await Borrow.findById(req.params.id).populate(
    "user",
    "name email avatar"
  );

  if (!borrow) {
    return next(new Errorhandler("Borrowing not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    borrow,
  });
});
// update borrow Status -- Admin/Approving
exports.updateStatus = catchasyncerror(async (req, res, next) => {
  const borrow = await Borrow.findById(req.body.id);
  if (!borrow) {
    return next(new Errorhandler("Not found", 401));
  }
  if (borrow.bookItems.stock === 0) {
    return next(new Errorhandler("Out of Stock", 401));
  }
  const book = await Book.findById(borrow.bookItems._id);
  book.stock -= 1;
  await book.save({ validateBeforeSave: false });

  borrow.borrowStatus = "Borrowed";
  borrow.borrowAt = new Date().toLocaleDateString();
  await borrow.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Approved Successfully",
  });
});
// Rejecting Request
exports.rejectborrow = catchasyncerror(async (req, res, next) => {
  const borrow = await Borrow.findById(req.body.id);
  if (!borrow) {
    return next(new Errorhandler("Borrow not found with this Id", 404));
  }
  await borrow.deleteOne();
  res.status(200).json({
    success: true,
    message:"Rejected Successfully"
  });
});

// delete borrow -- Admin //Return Action Approving
exports.Returnborrow = catchasyncerror(async (req, res, next) => {
  const borrow = await Borrow.findById(req.body.id);
  if (!borrow) {
    return next(new Errorhandler("Borrow not found with this Id", 404));
  }
  const book = await Book.findById(borrow.bookItems._id);
  book.stock += 1;
  await book.save({ validateBeforeSave: false });
  await borrow.deleteOne();
  res.status(200).json({
    success: true,
    message:"Return Successfully"
  });
});
