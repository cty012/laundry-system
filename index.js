const express = require("express");
const process = require("process");
const path = require("path");

//Change 
process.chdir(path.join(__dirname, "public"));

//Setup
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.listen("8080");

//Deal with GET request
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/views/helloworld.html"));
});
