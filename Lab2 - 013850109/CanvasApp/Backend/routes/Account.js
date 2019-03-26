var express = require('express');
var router = express.Router();
// var connection = require('../db/connection')
const UserModel = require('../model/model');
var fs = require('fs');

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

router.post('/', async function (req, res, callback) {
    console.log("Inside account post handler");
    var loggedInuser = decodeURI(req.user.emailId);
    console.log(loggedInuser);
    UserModel.findOne({ emailId: loggedInuser }, (err, user) => {
        
        if (err) {
            console.log("User not found.", err);
            callback(err, null);
        } else {
            console.log("The feteched user detail is " + user);
            console.log("The update request is " + JSON.stringify(req.body));
            

            console.log("Inside account Information Post Request");
            
            UserModel.update({_id:user._id}, {$set: {
                emailId: req.body.emailId,
                name: req.body.name,
                phoneNo: req.body.phoneNo,
                aboutMe: req.body.aboutMe,
                city: req.body.city,
                country: req.body.country,
                company: req.body.company,
                school: req.body.school,
                hometown: req.body.hometown,
                languages: req.body.languages,
                gender: req.body.gender
            }}).then((doc) => {

                console.log("User details saved successfully.", doc);
                res.send("Success");

            }, (err) => {
                console.log("Unable to save user details.", err);
                res.status(500).send("Unable to save user details");
            });
        
        }
        
    
    });
});

router.post('/img/:user', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        res.send(req.file.originalname)
    }
})

// router.get('/img/:user', function (req, res) {
//     console.log("Inside user get image handler");
//     var name = decodeURI(req.params.user);
//     console.log(req.params.courseUid)
//     var imgName = fs.readdirSync('public/img').filter(fn => fn.startsWith(name))[0];

//     console.log(imgName);
//     if (imgName === undefined) imgName = "default_profile_img.jpg"
//     let options = {
//         root: 'public/img',
//         dotfiles: 'deny',
//         headers: {
//             'x-timestamp': Date.now(),
//             'x-sent': true
//         }
//     };
//     res.sendFile(imgName, options, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Sent:', imgName);
//         }
//     });

// })

module.exports = router;