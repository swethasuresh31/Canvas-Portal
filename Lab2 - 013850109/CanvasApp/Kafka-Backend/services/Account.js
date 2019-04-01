var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method get account details. Message ', message);
    console.log('Inside Kafka Method get account details. Message ', message.emailId);
    Model.UserModel.findOne({
        'emailId': decodeURI(message.emailId)
        }, (err, user) => {

            if (err) {
                console.log("Unable to fetch user details.", err);
                callback(err, null);
            }
            else {

                console.log('Account Profile Data: ', user);
                callback(null, user);
            }
        });
}

exports.handle_request = handle_request;