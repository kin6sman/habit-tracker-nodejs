const mongoose = require("mongoose");

// Schema for Habit
const HabitSchema = new mongoose.Schema(
  {
    habit_name: {
      type: String,
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dates: [
      {
        date: String,
        complete: String,
      },
    ],
    fav: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Creating a model/collection for habit schema
const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;
