const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');

//Create a passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        console.log(req)
        //- Save the information provided by the user to the the database
        const user = await UserModel.create({
          emailId: username,
          password: password,
          name: req.body.name,
          role: req.body.role
        });
        //- Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
  try {
    console.log("login handler")
    console.log(username);
    console.log(password);
    
    //Find the user associated with the username provided by the user
    const user = await UserModel.findOne({ emailId : username });
    console.log(user);
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      console.log("password does not match")
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use('jwt', new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'CMPE_Lab2_Secret',
  //we expect the user to send the token as a auth header with the name ''
  jwtFromRequest : ExtractJWT.fromAuthHeaderWithScheme("jwt")
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));