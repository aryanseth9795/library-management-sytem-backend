const mongoose = require("mongoose");
const mongodbconnect = () => {
  mongoose.connect(process.env.URI
  ).then((data) => {
    console.log(`MongoDb connect to server at ${data.connection.host} `);
  });
};
module.exports = mongodbconnect;
