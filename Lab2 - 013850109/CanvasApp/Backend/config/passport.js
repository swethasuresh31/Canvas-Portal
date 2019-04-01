'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
//var db = require('../app/db');
//var config = require('./settings');
const secret = "CMPE_Lab2_Secret";

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    passport.use('jwt', new JwtStrategy(opts, function (token, done) {

        try {
            //Pass the user details to the next middleware
            return done(null, token.user);
          } catch (error) {
            done(error);
          }
    }));
};
