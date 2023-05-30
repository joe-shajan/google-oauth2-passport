import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export const connect = async () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("could not connect");
  });
  db.once("open", () => {
    console.log("> Successfully connected to database");
  });
};
