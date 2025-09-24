const mongoose = require("mongoose");

const dbConnect = async () => {
  console.log("Connecting DB...");
  const URL = process.env.MONGODB_URL;
  if (!URL) {
    throw new Error("Missing DB URL.");
  }
  try {
    mongoose
      .connect(URL)
      .then(() => {
        console.log("DB Connected");
      })
      .catch((err) => {
        console.log("DB Does not Connected");
      });
  } catch (errr) {
    console.log("Can  not connected to DB Some Internal server Err");
  }
};

module.exports = dbConnect;
