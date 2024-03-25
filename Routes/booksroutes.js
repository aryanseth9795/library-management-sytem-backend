const express = require("express");
const {
  getallbooks,
  createbook,
  updatebook,
  deletebook,
  getbookdetail,
  getAdminBook,
} = require("../Controllers/bookscontrollers");
const { isauthenticateduser, authorizerole } = require("../middleware/auth");
const { Multipleupload } = require("../middleware/multer");

const router = express.Router();

router
  .route("/books")
  .get( isauthenticateduser,getallbooks);
  router.route("/admin/books").get(isauthenticateduser, authorizerole("admin"),getAdminBook)
router
  .route("/admin/books/new")
  .post(isauthenticateduser, authorizerole("admin"),Multipleupload, createbook);
router
  .route("/books/:id")
  .put(isauthenticateduser, authorizerole("admin"), updatebook)
  .delete(isauthenticateduser, authorizerole("admin"), deletebook)
  .get(isauthenticateduser,getbookdetail);
module.exports = router;
