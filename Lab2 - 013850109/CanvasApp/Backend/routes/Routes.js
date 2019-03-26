const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
  res.json({ 
    message : 'Signup successful',
    user : req.user 
  });
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {     try {
        if(err || !user){
          console.log(req.username);
          console.log(req.password);
          const error = new Error('An Error occured')
          console.log(err);
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          console.log(JSON.stringify(user))
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
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
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user : body },'CMPE_Lab2_Secret');
          //Send back the token to the user
          return res.json({ token:token,emailId:user.emailId,role:user.role });
        });     } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
  
  module.exports = router;