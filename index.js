const express = require("express");
const ejs = require("ejs");
const db = require("./config/mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", require("./routes"));

app.listen(8000, () => {
  console.log("server is running at port: 8000");
});
