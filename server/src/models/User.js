import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    wins: {
      type: Number,
      default: 0,
    },

    losses: {
      type: Number,
      default: 0,
    },

    draws: {
      type: Number,
      default: 0,
    },

    gamesPlayed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
