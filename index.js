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
function home(req, res) {
    res.sendFile(path.join(__dirname, "/public/views/home/index.html"));
}

app.get("/", home);
app.get("/home", home);

app.get("/status/washer", (req, res) => {
    res.json([
        {
            "id": "W1",
            "status": "idle",
            "person": null,
            "start_time": null
        }
    ]);
});

app.get("/status/washer/:id", (req, res) => {
    res.json({
        "id": req.params.id,
        "status": "idle",
        "person": null,
        "start_time": null
    });
});
