var Model = require('../DatabaseConnection');
var bcrypt = require('bcrypt-nodejs');


function handle_request(msg, callback){
    console.log('Inside  Kafka Backend Login');
    console.log('Message', msg);

    Model.UserModel.findOne({
        'emailId': msg.username
    }, (err, user) => {

        if (err) {
            console.log("Unable to fetch user details.", err);
            callback(err, null);
        }
        else {

            if(user){
                console.log("User details ", user);
                if (!bcrypt.compareSync(msg.password, user.password)) {                
                    console.log('Invalid Credentials!');
                    callback(null, null);                
                }
                else {
                
                    callback(null, user);
                }
            }
            else{
                callback(null, null);
            }
            

        }

    });
}

exports.handle_request = handle_request;