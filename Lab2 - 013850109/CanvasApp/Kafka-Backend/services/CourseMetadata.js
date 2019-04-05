var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Method course dashboard. Message ', message);
    try {
      var terms = await Model.CourseModel.find().distinct('course_term')
      var depts = await Model.CourseModel.find().distinct('course_dept_code')
      var result = 
      callback(null, {
          terms: terms,
          departments: depts
    });

    } catch (err) {
        console.log("Unable to get course details.", err);
        callback(err, null);
    }

}

exports.handle_request = handle_request;