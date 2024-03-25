// const dotenv = require("dotenv");
const app = require("./app");
const connectdatabse = require("./config/database");
const cloudinary = require("cloudinary");
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Server is shutting Down Due to uncaughtRejection `);
  server.close(() => {
    process.exit(1);
  });
});
//configuration
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "../BACKEND/config/config.env" });
}
//connecting to database
connectdatabse();
// connecting cloudanary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Running at localhost: ${process.env.PORT}`);
});

//Unhandled unacaught error
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Server is shutting Down Due to unhandledRejection `);
  server.close(() => {
    process.exit(1);
  });
});
