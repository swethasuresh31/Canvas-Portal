var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method Get Sent Messages. Message ', message);
    
    Model.UserModel.findOne({emailId : message.user.emailId}, (err, user) => {
        if (err) {
            console.log("Unable to get the sent messages.", err);
            callback(err, null);
        }
        else {
            console.log('Sent Messages kafka: ', JSON.stringify(user.sent));
            callback(null, user.sent);
        }
    });
}

exports.handle_request = handle_request;