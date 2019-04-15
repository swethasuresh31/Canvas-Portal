//Signup.js - Signup route module
var express = require('express');
var router = express.Router();

//Kafka
var kafka = require('../kafka/client');

//Signup
router.post('/', function (req, res) {

    console.log('Inside Signup POST');
    console.log('Request Body: ', req.body);

    kafka.make_request('signup', req.body, function(err, result){
        console.log('In results Signup');
        console.log('Results: ', result);
        if(result){            
            console.log("User saved successfully.");
            res.end('Adding a user successful!');
        }
        else if(result === null){
            console.log("User already exists.");
            res.status(210).end('Dupplicate user!');
        }

        if(err){
            console.log("Unable to fetch user details. Error in Signup.", err);
            res.end('Error in fetching user details!');            
        }
    });
});

module.exports = router;