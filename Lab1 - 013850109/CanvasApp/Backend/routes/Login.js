var express = require('express');
var router = express.Router();
var connection = require('../db/connection')
const bcrypt = require('bcrypt');

router.post('/', function (req, response) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("Inside Login Post Request");
    console.log("Req Body : ", req.body);
    connection.query('SELECT password,is_student FROM user WHERE email_id = ?', [username], function (error, results, fields) {
        if (results.length == 0) {
            response.status(404).send("Username does not exists!");
        } else {
            bcrypt.compare(password, results[0].password, function (err, res) {
                if (res) {
                    if (results[0].is_student) {
                        response.cookie('cookieS', username, { maxAge: 900000, httpOnly: false, path: '/' });
                        req.session.user = username;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain'
                        })
                        response.end("Student");
                    } else {
                        response.cookie('cookieF', username, { maxAge: 900000, httpOnly: false, path: '/' });
                        req.session.user = username;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain'
                        })
                        response.end("Faculty");
                    }
                }
                else {
                    response.status(400).send("Incorrect Password!");
                }
            });
        }
    });

});

module.exports = router;