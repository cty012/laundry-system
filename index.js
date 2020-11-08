const express = require("express");
const path = require("path");
const process = require("process");
const db = require("./database/manager.js");

// Change default folder
process.chdir(path.join(__dirname, "public"));

// Set up server
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.listen("8080");

// Set up the database manager
var dbManager = new db.DBManager("laundry", "prismsus", "laundry_system");

// Deal with GET request
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/views/login/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/views/login/index.html"));
});

// Deal with POST request
app.post("/home", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    dbManager.getUserPassword(username, pwd => {
        if (pwd == password) {
            res.render(path.join(__dirname, "/public/views/home/index.ejs"), data = {username: username});
        }
    });
});
