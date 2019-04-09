var Model = require('../DatabaseConnection');

function handle_request(message, callback){
    console.log('Inside Kafka Method update-account. Message ', message);

    Model.UserModel.findOne({
        'emailId': decodeURI(message.body.emailId)
    }, (err, user) => {

        if (err) {
            console.log("Unable to fetch user details.", err);
            callback(err, null);
        }
        else {
            console.log('UserModel', user);

            var com = 'company'

            Model.UserModel.update({_id:user._id}, {$set: {
                emailId: message.body.emailId,
                name: message.body.name,
                phoneNo: message.body.phoneNo,
                aboutMe:message.body.aboutMe,
                city: message.body.city,
                country: message.body.country,
                [com]: message.body.company,
                school: message.body.school,
                hometown: message.body.hometown,
                languages: message.body.languages,
                gender: message.body.gender
            }}).then((doc) => {

                console.log("User details saved successfully.", doc);
                callback(null, doc);

            }, (err) => {
                console.log("Unable to save user details.", err);
                callback(err, null);
            });
        }
    });
}

exports.handle_request = handle_request;