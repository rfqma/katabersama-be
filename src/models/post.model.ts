import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    post_id: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);

export default postModel;
