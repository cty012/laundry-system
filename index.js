const express = require("express");
const path = require("path");
const process = require("process");

const db = require("./utils/database.js");
const q = require("./utils/queue.js");

// Change default folder
process.chdir(path.join(__dirname, "public"));

// Set up server
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.listen("8080");

// Set up the classes
var dbManager = new db.DBManager("laundry", "prismsus", "laundry_system");
var washer = new q.Queue(6, "W", 1 * 60 * 1000, 0.5 * 60 * 1000);
var dryer = new q.Queue(6, "D", 1 * 60 * 1000, 0.5 * 60 * 1000);

// Deal with GET request
function home(req, res) {
    res.sendFile(path.join(__dirname, "/public/views/home/index.html"));
}

app.get("/", home);
app.get("/home", home);

app.get("/status", (req, res) => {
    var status = Object.assign(washer.readMachines(), dryer.readMachines());
    res.json(status);
});

app.get("/queue/:machine_type/:action/usr/:username/pwd/:password", (req, res) => {
    // add to queue
    var machine_type = {"washer": washer, "dryer": dryer}[req.params.machine_type];
    if (req.params.action == "enter") {
        machine_type.add(req.params.username);
    } else if (req.params.action == "exit") {
        machine_type.remove(req.params.username);
    }
    washer.checkFinish();
    dryer.checkFinish();
    // response
    var status = Object.assign(washer.readMachines(), dryer.readMachines());
    res.json(status);
});
