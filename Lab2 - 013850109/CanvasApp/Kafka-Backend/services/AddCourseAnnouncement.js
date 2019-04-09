var Model = require('../DatabaseConnection');

async function handle_request(message, callback){
    console.log('Inside Kafka Backend Add Announcement');
    console.log('Message: ', message);
    try {
        var addAnnouncement = await Model.CourseModel.update({ '_id': message.params.course_uid }, {
            $push: { announcements: 
                { 
                    header: message.body.subject,
                    body: message.body.body,
                    created_by: message.user.emailId
                 } },
        })
        callback(null, { updateStatus: "Success", Announcement: addAnnouncement });
    }
    catch (error) {
        console.log(error)
        callback(error, null);
    }
}

exports.handle_request = handle_request;