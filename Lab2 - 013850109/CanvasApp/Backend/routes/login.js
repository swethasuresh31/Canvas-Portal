//Login.js - Login route module
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

//Kafka
var kafka = require('../kafka/client');
const secret = "CMPE_Lab2_Secret";

//Login validation
router.post('/', function (req, res) {

    console.log('Inside login POST');
    console.log('Request Body: ', req.body);

    //Kafka request 

    kafka.make_request('login', req.body, function(err, user){
        console.log('In results login');
        console.log('results', user);
        if(err){
            console.log('Inside error login');
            res.writeHead(400, {
                'Content-type': 'text/plain'
            });
            res.end('Error in login!');
        }
        else{
            console.log('Inside results Login');
            if(user){
                req.session.user = user;

                const body = { _id : user._id, 
                    emailId : user.emailId, 
                    name: user.name, 
                    role: user.role, 
                    phoneNo: user.phoneNo, 
                    aboutMe: user.aboutMe, 
                    city: user.city,
                    country: user.country, 
                    company: user.company,
                    school: user.school,
                    hometown: user.hometown,
                    languages: user.languages,
                    gender: user.gender,
                    img: user.img 
                  };

                // Create token if the password matched and no error was thrown
                var token = jwt.sign({ user : body }, secret, {
                    expiresIn: 10080 // in seconds
                });

                //res.json({success: true, token: 'JWT ' + token});
                // res.writeHead(200, {
                //     'Content-type': 'text/plain'
                // });
                
                //res.status(200).json({success: true, Authorization: 'Bearer ' + token});
                return res.json({ token:token,emailId:user.emailId,role:user.role });
            }
            else{
                console.log('Invalid Credentials!');
                res.end('Invalid Credentials!');
            }            
        }
    });

    //Query    
});

module.exports = router;