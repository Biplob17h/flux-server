import mongoose from "mongoose";

const adminphotoSchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("AdminPhoto", adminphotoSchema);
