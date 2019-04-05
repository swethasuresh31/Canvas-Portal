var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method course dashboard. Message ', message);
    
    Model.UserModel.findOne({
        'emailId': decodeURI(message.emailId)
    }, (err, user) => {
        if (err) {
            console.log("Unable to get course details.", err);
            callback(err, null);
        }
        else {
            console.log('Course Details kafka: ', JSON.stringify(user.course));
            callback(null, user.course);
        }
    });
}

exports.handle_request = handle_request;