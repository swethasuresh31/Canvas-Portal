var mysql = require('mysql');

var db;

function getInstance() {
    if (!db) {
db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminuser',
    database: 'canvas',
    multipleStatements: true,
    dateStrings: true
  });
  
  db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
}
return db;
}

module.exports = getInstance();