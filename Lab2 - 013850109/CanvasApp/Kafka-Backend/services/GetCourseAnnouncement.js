var Model = require('../DatabaseConnection');

async function handle_request(message, callback){
    console.log('Inside Kafka Method Get Course Announcement by Announcement ID. Message ', message);
    await Model.CourseModel.findById(message.params.course_uid, async (err, course) => {
        if (err) {
            console.log("Unable to get the course announcements.", err);
            callback(err, null);
        }
        else {
            var announcement = await course.announcements.find(announcement => String(announcement._id) === String(message.params.announcement_uid))
            console.log('Announcements kafka: ', JSON.stringify(announcement));
            callback(null, announcement);
        }
    });
}

exports.handle_request = handle_request;