const express = require("express");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const ejs = require("ejs");
const db = require("./config/mongoose");

const app = express();

app.use(express.static("./assets"));
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayout);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use("/", require("./routes/index"));
// app.get("/", require("./routes"));

app.listen(8000, () => {
  console.log("server is running at port: 8000");
});
