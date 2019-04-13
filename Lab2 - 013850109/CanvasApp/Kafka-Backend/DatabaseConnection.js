const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
// mongoose.connect('mongodb://127.0.0.1:27017/canvas-app', { useNewUrlParser: true, poolSize: 10, });
mongoose.connect('mongodb+srv://dbuser:dbuserpwd@canvas-app-tbdky.mongodb.net/canvas-app?retryWrites=true');
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://dbuser:@ds235807.mlab.com:35807/canvas');


const userListSchema = new Schema({
    emailId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String
    }
});
userListSchema.plugin(autoIncrement.plugin, 'enrolled');

const permissionSchema = new Schema({
    permissionCode: {
        type: Number,
        unique: true,
        sparse: true,
    },
    isUsed: {
        type: Boolean,
    }
});

const announcementSchema = new Schema({
    header: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: String,
        required: true,
    },
});

const quizSchema = new Schema({
    question_number: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    first_option: {
        type: String,
        required: true,
    },
    second_option: {
        type: String,
        required: true,
    },
    third_option: {
        type: String,
        required: true,
    },
    fourth_option: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
})

const courseworkSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        sparse:true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    total_points: {
        type: Number,
        required: true,
    },
    instructions: {
        type: String,
    },
    questions: {
        type: [quizSchema],
        default: [],
    }
});

const userCourseworkSchema = new Schema({
    coursework_uid:{
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    total_points: {
        type: Number,
        required: true,
    },
    score:
    {
        type: Number
    },
});


const CourseSchema = new Schema({
    course_id: {
        type: String,
        required: true,
    },
    course_term: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_dept: {
        type: String,
        required: true
    },
    course_dept_code: {
        type: String,
        required: true
    },
    course_desc: {
        type: String
    },
    course_room: {
        type: String
    },
    course_capacity: {
        type: Number,
        required: true,
    },
    total_enrollment: {
        type: Number,
        required: true,
        default: 0
    },
    enrolled: {
        type: [userListSchema],
        default: [],
    },
    waitlist_capacity: {
        type: Number,
        required: true,
    },
    total_waitlist: {
        type: Number,
        required: true,
        default: 0
    },
    waitlisted: {
        type: [userListSchema],
        default: [],
    },
    permissionCodes: {
        type: [permissionSchema],
        default: [],
    },
    course_dayandtime: {
        type: String
    },
    course_instructor: {
        type: String
    },
    course_syllabus: {
        type: String
    },
    created_by: {
        type: String
    },
    quizzes: {
        type: [courseworkSchema],
        default: [],
    },
    assignments: {
        type: [courseworkSchema],
        default: [],
    },
    announcements: {
        type: [announcementSchema],
        default: [],
    }
})

CourseSchema.index({ course_id: 1, course_term: 1, course_dept_code: 1 }, { name: 'course_pkey', unique: true })
CourseSchema.plugin(autoIncrement.plugin, 'course');

const CourseModel = mongoose.model('course', CourseSchema);

const messageSchema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    recipient: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
});


const userCourseSchema = new Schema({
    course_uid: {
        type: Number,
        required: true
    },
    course_id: {
        type: String,
        required: true,
    },
    course_term: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_dept: {
        type: String,
        required: true
    },
    course_dept_code: {
        type: String,
        required: true
    },
    isWaitlist:
    {
        type: Boolean,
        required: true,
        default: false
    },
    course_capacity: {
        type: Number
    },
    total_enrollment: {
        type: Number
    },
    waitlist_capacity: {
        type: Number
    },
    total_waitlist: {
        type: Number
    },
    coursework_submissions: {
        type: [userCourseworkSchema],
        default: [],
    }
})

const userCourseModel = mongoose.model('usercourse', userCourseSchema);

const UserSchema = new Schema({
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String, enum: ['student', 'faculty'],
        required: true
    },
    phoneNo: {
        type: String
    },
    aboutMe: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    company: {
        type: String
    },
    school: {
        type: String
    },
    hometown: {
        type: String
    },
    languages: {
        type: String
    },
    gender: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    },
    course: {
        type: [userCourseSchema],
        default: [],
    },
    inbox:{
        type: [messageSchema],
        default:[],
    },
    sent:{
        type: [messageSchema],
        default:[],
    },

})

UserSchema.index({ emailId: 1 }, { name: 'user_email_pkey', unique: true })
UserSchema.plugin(autoIncrement.plugin, 'user');

const UserModel = mongoose.model('user', UserSchema);

module.exports = { UserModel, CourseModel, userCourseModel };
