require("dotenv").config();
const mongoose = require("mongoose");

const DB_CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@alpha.h0q6rdf.mongodb.net/ehrs?retryWrites=true&w=majority`;

const connectDB = () => {
  return mongoose.connect(DB_CONNECTION_URL);
};

module.exports = connectDB;