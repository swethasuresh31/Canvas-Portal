var express = require('express');
var router = express.Router();
var fs = require('fs');
var connection = require('../db/connection')

var multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({ storage });


router.put('/', function (req, res) {
    var username = req.body.username;
    var name = req.body.name;
    var phoneNo = req.body.phoneNo;
    var aboutMe = req.body.aboutMe;
    var city = req.body.city;
    var country = req.body.country;
    var company = req.body.company;
    var school = req.body.school;
    var hometown = req.body.hometown;
    var languages = req.body.languages;
    var gender = req.body.gender;

    console.log("Inside account Information Put Request");
    console.log("Req Body : ", req.body);
    connection.query('UPDATE user SET name = ?, phone_number = ?,about_me = ?, city = ?, country =?, company = ?, school =?, hometown =?, languages =?,gender =? WHERE email_id = ?;',
        [name, phoneNo, aboutMe, city, country, company, school, hometown, languages, gender, username], function (error, results, fields) {
            console.log();
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Success");
            }
        });
});

router.post('/img/:user', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        connection.query
        res.send(req.file.originalname)
    }
})

router.get('/img/:user', function (req, res) {
    console.log("Inside user get image handler");
    var name = decodeURI(req.params.user);
    console.log(req.params.courseUid)
    var imgName = fs.readdirSync('public/img').filter(fn => fn.startsWith(name))[0];

    console.log(imgName);
    if (imgName === undefined) imgName = "default_profile_img.jpg"
    let options = {
        root: 'public/img',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile(imgName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', imgName);
        }
    });

})

module.exports = router;