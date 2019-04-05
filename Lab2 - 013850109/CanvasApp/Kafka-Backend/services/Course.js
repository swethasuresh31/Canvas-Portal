var Model = require('../DatabaseConnection');

async function handle_request(message, callback) {
    console.log('Inside Kafka Method course search. Message ', message);
    try {
    
    var search = Model.CourseModel

    if (message.query.term !== '') {
        search = search.where('course_term',  message.query.term);
    }
    if (message.query.department !== '') {
        search = search.where('course_dept_code',  message.query.department);
    }
    if (message.query.name !== '') {
        search = search.where('course_name',  message.query.name);
    }
    if (message.query.operator !== '' && message.query.courseId !== '') {
        if (message.query.operator === 'EQ') {
            search = search.where('course_id',  message.query.courseId);
        } else if (message.query.operator === 'CON') {
            search = search.where('course_id',  { '$regex' : message.query.courseId, '$options' : 'i' });
        } else if (message.query.operator === 'LTE') {
            search = search.where('course_id').lte(message.query.courseId);
        } else if (message.query.operator === 'GTE') {
            search = search.where('course_id').gte(message.query.courseId);
        }
    }
      var courses = await search
      console.log("Course Result: " + JSON.stringify(courses))
      callback(null, courses);

    } catch (err) {
        console.log("Unable to get course details.", err);
        callback(err, null);
    }

}

exports.handle_request = handle_request;