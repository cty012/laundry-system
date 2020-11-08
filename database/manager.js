const mysql = require("mysql");

// Database Manager
class DBManager {
    constructor(user, password, database) {
        this.user = user;
        this.password = password;
        this.database = database;
        this.conn = mysql.createConnection({
            host: "127.0.0.1",
            user: this.user,
            password: this.password,
            database: this.database,
        });
        this.conn.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }
    addUser(username, password) {
        this.addUsers([[username, password]]);
    }
    addUsers(users) {
        var query = `INSERT INTO users (username, password) VALUES ?;`;
        this.conn.query(query, [users], function (err, result, fields) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    getUserPassword(username, callback) {
        var query = `Select * FROM users WHERE username=?;`;
        this.conn.query(query, [username], function (err, result) {
            if (err) throw err;
            callback(result[0].password);
        });
    }
}

exports.DBManager = DBManager;
