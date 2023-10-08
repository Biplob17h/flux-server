import mongoose from "mongoose";

const ourstorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    subtitle: {
      type: String,
      required : true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OurStory", ourstorySchema);
