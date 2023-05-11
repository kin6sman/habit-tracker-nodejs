const mongoose = require("mongoose");

// Schema for habit
const habitSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    habitName: {
      type: String,
      required: true,
    },
    record_tracker: {
      type: Map,
    },
    dates: [
      {
        date: String,
        complete: String,
      },
    ],
  },
  {
    timestamp: true,
  }
);

// creating a model for habit schema
const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;
