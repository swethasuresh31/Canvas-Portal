var Model = require('../DatabaseConnection');

async function handle_request(message, callback){
    console.log('Inside Kafka Backend Send Message');
    console.log('Message: ', message);
    try {

        //Send Message to receiver
        var updateReceiver = await Model.UserModel.update({ 'emailId': message.body.recipient }, {
            $push: { inbox: 
                { 
                    subject: message.body.subject,
                    body: message.body.body,
                    sender: message.user.emailId,
                 } 
                },
        })
        
        var updateReceiver = await Model.UserModel.update({ 'emailId': message.user.emailId }, {
            $push: { sent: 
                { 
                    subject: message.body.subject,
                    body: message.body.body,
                    recipient: message.body.recipient,
                 } 
                },
        })

        callback(null, { updateStatus: "Success", updateReceiver: updateReceiver });
    }
    catch (error) {
        console.log(error)
        callback(error, null);
    }
}

exports.handle_request = handle_request;