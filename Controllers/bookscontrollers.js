const catchasyncerror = require("../middleware/catchasyncerror");
const Book = require("../models/booksmodels");
const Borrow = require("../models/book_borrow_model");
const apifeature = require("../utils/apifeature");
const Errorhandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");

//create books
exports.createbook = catchasyncerror(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];
  for (let i = 0; i <images.length  ; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "books",
      crop: "scale",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const book = await Book.create(req.body);
  res.status(201).json({
    success: true,
    book,
  });
});

//fetching all details
exports.getallbooks = catchasyncerror(async (req, res) =>{
  const resultPerPage = 8;
  const booksCount = await Book.countDocuments();

  const Apifeature = new apifeature( Book.find(), req.query)
    .search()
    .filter().pagination(resultPerPage);

  let  allbooks = await Apifeature.query;
  let filteredbooksCount = allbooks.length;
  res.status(200).json({
    success: true,
    allbooks,
    booksCount,
    resultPerPage,
    filteredbooksCount,
  });
});

//Get All books ----->Admin
exports.getAdminBook = catchasyncerror(async (req, res, next) => {
  const allbooks = await Book.find();
  res.status(200).json({
    success: true,
    allbooks,
  });
});
//Updating Details ----->Admin
exports.updatebook = catchasyncerror(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  if (!book) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    findAndModify: false,
  });
  res.status(200).json({
    success: true,
 message:"Book Updated Successfully"
  });
});
//deleting the book------->Admin
exports.deletebook = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  for (let i = 0; i < book.images.length; i++) {
    await cloudinary.v2.uploader.destroy(book.images[i].public_id);
  }

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Data Deleted Successfully",
  });
};
//getting the detail of the one book ------->Admin
exports.getbookdetail = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const borrow=await Borrow.findOne({ user: req.user._id,bookItems:book})
  let status="Borrow";

  if(borrow){
     status=borrow.borrowStatus;
  }
  if (!book) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    book,
    status
  });
};
