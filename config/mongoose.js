const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://rahul:rahul001@cluster0.uzoqy7q.mongodb.net/habit_tracker")
  .then(() => console.log("Mongodb Connected"))
  .catch((e) => console.log(e));
  