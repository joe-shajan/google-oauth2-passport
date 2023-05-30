import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  picture: {
    type: String,
  },
});

export const User = mongoose.model("GoogleUser", UserSchema);
