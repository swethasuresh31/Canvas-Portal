var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Method Get Message by Message ID. Message ', message);
    try {
        if (message.params.type === 'inbox') {
            findMessageInInbox(message, callback);
        }
        else {
            findMessageInSent(message, callback);
        }

    }
    catch (error) {
        callback(error, null);
    }

}

findMessageInInbox = async (message, callback) => {
    console.log("Getting Message from Inbox: " + message.params.message_id);
    await Model.UserModel.findById(message.user._id, (err, user) => {
        if (err) {
            console.log("Unable to get the message.", err);
            callback(err, null);
        }
        else {
            var message1 =  user.inbox.find(inboxMessage => String(inboxMessage._id) === String(message.params.message_id))
            console.log('Message kafka: ', JSON.stringify(message1));
            callback(null, message1);
        }
    });
}


findMessageInSent = async (message, callback) => {
    console.log("Getting Message from Sent: " + message.params.message_id);
    await Model.UserModel.findById(message.user._id, (err, user) => {
        if (err) {
            console.log("Unable to get the message.", err);
            callback(err, null);
        }
        else {
            var message1 =  user.sent.find(userMessage => String(userMessage._id) === String(message.params.message_id))
            console.log('Message kafka: ', JSON.stringify(message1));
            callback(null, message1);
        }
    });
}

exports.handle_request = handle_request;