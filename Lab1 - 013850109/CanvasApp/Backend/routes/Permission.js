var express = require('express');
var router = express.Router();
var connection = require('../db/connection')
const bcrypt = require('bcrypt');

router.get('/:course', function (req, res) {
    permissionCode = Math.floor(Math.random() * 90000000) + 10000000;
    this.checkUniqueAndInsert(req.params.course, permissionCode, res);
})

checkUniqueAndInsert = (courseUid, permissionCode, res) => {
    console.log("Checkin: " + permissionCode)
    connection.query('select * from permission_code where permission_code = ?;', [permissionCode], function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
        } else {
            console.log(results.length)
            if (results.length === 0) {
                insertIntoPermissionTable(courseUid, permissionCode, res);
            } else {
                permissionCode = Math.floor(Math.random() * 90000000) + 10000000;
                checkUniqueAndInsert(courseUid, permissionCode, res);
            }
        }
    });
}

insertIntoPermissionTable = (courseUid, permissionCode, res) => {
    console.log("inserting");
    connection.query('insert into permission_code (course_uid, permission_code, isUsed) values (?,?,?)', [courseUid, permissionCode, false], function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            console.log("inserted")
            res.status(200).send(JSON.stringify({ permissionCode: permissionCode }))
        }
    });
}

module.exports = router;