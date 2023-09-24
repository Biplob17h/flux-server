import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: false,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
