var Model = require('../DatabaseConnection');
var bcrypt = require('bcrypt-nodejs');
var mongooseTypes = require('mongoose').Types;

function handle_request(message, callback) {
    console.log('Inside Kafka Backend Signup');
    console.log('Message: ', message);


    //User creation query

    const profileId = mongooseTypes.ObjectId();

    //Check if user exists

    Model.UserModel.findOne({
        'emailId': message.username
    }, (err, user) => {

        if (err) {
            console.log("Unable to fetch user details.", err);
            callback(err, null);
        }
        else {

            if (user) {
                console.log('User Exists!', user);
                callback(null, null);

            }
            else {

                //Hashing Password!
                const hashedPassword = bcrypt.hashSync(message.password);

                var user = new Model.UserModel({
                    emailId: message.username,
                    password: hashedPassword,
                    name: message.name,
                    role: message.role
                  });
            }

            user.save().then((doc) => {

                console.log("User saved successfully.", doc);
                callback(null, doc);

            }, (err) => {
                console.log("Unable to save user details.", err);
                callback(err, null);
            });

        }

    });

}

exports.handle_request = handle_request;