var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method Get Inbox Messages. Message ', message);
    
    Model.UserModel.findOne({emailId : message.user.emailId}, (err, user) => {
        if (err) {
            console.log("Unable to get the inbox messages.", err);
            callback(err, null);
        }
        else {
            console.log('Announcements kafka: ', JSON.stringify(user.inbox));
            callback(null, user.inbox);
        }
    });
}

exports.handle_request = handle_request;