var express = require('express');
var router = express.Router();
var connection = require('../db/connection')
const bcrypt = require('bcrypt');

router.post('/', function (req, res) {
    var email_id = req.body.emailId;
    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var password = req.body.password;
    var name = req.body.name;
    var role = req.body.role === 'student';
    console.log("Inside Signup Post Request");
    console.log("Req Body : ", req.body);
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err;
        password = hash;
        connection.query('INSERT INTO user (email_id, first_name, last_name , password, is_student) VALUES (?,?,?,?,?);', [email_id, first_name, last_name, password, role], function (error, results, fields) {
            console.log();
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Success");
            }
        });
    });

});

module.exports = router;