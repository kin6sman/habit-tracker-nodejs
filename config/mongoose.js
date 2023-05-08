const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0/habit_tracker")
  .then(() => console.log("Mongodb Connected"))
  .catch((e) => console.log(e));
