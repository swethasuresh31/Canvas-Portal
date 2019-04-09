//User Account profile information
var express = require('express');
var router = express.Router();
//Passport authentication

var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false});
//Kafka
var kafka = require('../kafka/client');

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

router.get('/:emailId', requireAuth, function (req, res) {

    console.log("Inside account get handler");
    console.log('Request Body:', req);


        kafka.make_request("account-details", req, function(err, result){
            if(err){
                console.log("Unable to fetch user account details.", err);
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end('Error in fetching user details!');
            }
            else{
                console.log('Profile Information: ', result);
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        });        
    
});

router.post('/', requireAuth, function (req, res) {

    console.log('Inside Update Account Details!');
    console.log('Request Body: ', req.body);

        kafka.make_request("update-account", req, function(err, result){

            if(err){
                console.log("Unable to save user details.", err);
                res.writeHead(400, {
                        'Content-type': 'text/plain'
                });
                res.end('Error in adding an user');
            }
            else{
                console.log("User details saved successfully.", result);
                res.writeHead(200, {
                        'Content-type': 'text/plain'
                });
                res.end('User details saved successfully.');
            }
        });        
  
});

router.post('/img', upload.single('file'), function (req, res) {
    console.log(req.file)
    if (!req.file) {
        res.status(500).send("No file");
    } else {
        res.send(req.file.originalname)
    }
})

module.exports = router;