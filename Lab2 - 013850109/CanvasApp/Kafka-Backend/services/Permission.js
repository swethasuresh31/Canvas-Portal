var Model = require('../DatabaseConnection');

function handle_request(message, callback) {
    console.log('Inside Kafka Method Permission. Message ', message);
    permissionCode = Math.floor(Math.random() * 90000000) + 10000000;
    checkUniqueAndInsert(message.params.course, permissionCode, callback);
}

checkUniqueAndInsert = (courseUid, permissionCode, callback) => {
    console.log("Checking: " + permissionCode)

    Model.CourseModel.findOne({
        '_id': courseUid,
        'permissionCodes.permissionCode': permissionCode
    }, (err, course) => {
        if (err) {
            console.log("Unable to generate permission number.", err);
            callback(err, null);
        }
        else if (course) {
            console.log('Permission number: ' + permissionCode + ' exists for course: ' + courseUid);
            permissionCode = Math.floor(Math.random() * 90000000) + 10000000;
            checkUniqueAndInsert(courseUid, permissionCode, callback);
        } else {
            console.log("Permission code is unique")
            insertIntoPermissionTable(courseUid, permissionCode, callback);
        }
    });
}

insertIntoPermissionTable = (courseUid, permissionCode, callback) => {
    console.log("inserting");

    Model.CourseModel.update({ _id: courseUid }, {
        $push: {
            permissionCodes: {
                permissionCode: permissionCode,
                isUsed: false,
            }
        }
    }, (err, course) => {
        if (err) {
            console.log("Unable to generate permission number.", err);
            callback(err, null);
        }
        else if (course) {
            console.log('Inserted successfully');
            callback(null, {permissionCode: permissionCode})
        } else {
            console.log("failed")
            callback(null,null)
        }
    })
}





exports.handle_request = handle_request;