// Import required modules
const express = require("express"); // Express framework for web application
const port = process.env.PORT || 8000;

const path = require("path"); // Built-in Node.js module for working with file paths
const expressLayout = require("express-ejs-layouts"); // Middleware for using EJS layouts
const ejs = require("ejs"); // Templating engine for generating dynamic HTML
const db = require("./config/mongoose"); // Custom module for connecting to MongoDB

// Create Express application
const app = express();

// Set up moment.js for date formatting


// Serve static files from the "assets" directory
app.use(express.static("./assets"));

// Parse URL-encoded request bodies
app.use(express.urlencoded());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the directory for views
app.set("views", "./views");

// Use EJS layouts
app.use(expressLayout);

// Extract CSS styles and JavaScript scripts from layout files
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Set up routes
app.use("/", require("./routes/index")); // Use the index route for the root URL ("/")
// app.get("/", require("./routes")); // Alternative syntax for specifying the root route

// Start the server and listen on port 8000
app.listen(port, () => {
  console.log("server is running at port: 8000");
});
