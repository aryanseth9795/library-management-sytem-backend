const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const Errormiddleware = require("./middleware/error");
const cors = require("cors");
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/config.env" });
}
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true,limit: "50mb"}));
app.use(express.urlencoded({ extended: true, limit: "50mb"}));
//importing routes
const books = require("./Routes/booksroutes");
const users = require("./Routes/userroutes");
const borrow=require("./Routes/borrowroutes");

//  Adding Routes
app.use("/api/v1", books);
app.use("/api/v1", users);
app.use("/api/v1", borrow);
app.get("/", (req, res) => {  
  res.send("Hello from the server");
});



//Error middleware
app.use(Errormiddleware);
module.exports = app;
