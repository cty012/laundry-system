const express = require("express");
const process = require("process");
const path = require("path");

//Change 
process.chdir(path.join(__dirname, "public"));

//Setup
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.listen("8080");

// file system
class AppManager {
    constructor(path) {
        this.root = path;
    }
    readFile(relPath) {
        return fs.readFileSync(path.join(this.root, relPath), {encoding: "utf8"});
    }
    getFiles(relPath) {
        return fs.readdirSync(path.join(this.root, relPath)).filter(file => file != ".DS_Store");
    }
    getAppList() {
        return this.getFiles("/");
    }
    getInfo(id) {
        return JSON.parse(this.readFile(path.join(id, "/info.json")));
    }
    getDescription(id) {
        return this.readFile(path.join(id, "/description.html"));
    }
    getNumImgs(id) {
        return this.getFiles(path.join(id, "/carousel")).filter(file => file.toLowerCase().endsWith(".png")).length;
    }
}


var appManager = new AppManager(path.join(__dirname, "/public/resources/app"));

//Deal with GET request
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/views/home/helloworld.html"));
});



