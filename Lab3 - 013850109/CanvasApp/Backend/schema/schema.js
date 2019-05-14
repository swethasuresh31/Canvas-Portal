const graphql = require('graphql');
const _ = require('lodash');
// var Model = require('../DatabaseConnection');
const connection = require('../db/connection')
const bcrypt = require('bcrypt');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        email_id: {
            type: GraphQLString,
        },
        password: {
            type: GraphQLString,
        },
        first_name: {
            type: GraphQLString,
        },
        last_name: {
            type: GraphQLString,
        },
        role: {
            type: GraphQLString,
        },
        is_student: {
            type: GraphQLString,
        },
        phone_number: {
            type: GraphQLString
        },
        about_me: {
            type: GraphQLString
        },
        city: {
            type: GraphQLString
        },
        country: {
            type: GraphQLString
        },
        company: {
            type: GraphQLString
        },
        school: {
            type: GraphQLString
        },
        hometown: {
            type: GraphQLString
        },
        languages: {
            type: GraphQLString
        },
        gender: {
            type: GraphQLString
        },
        // courses: {
        //     type: new GraphQLList()
        // }
    })
});

const Course = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        course_id: { type: GraphQLInt },
        course_name: { type: GraphQLString },
        course_dept: { type: GraphQLString },
        course_dept_code: { type: GraphQLString },
        course_desc: { type: GraphQLString },
        course_room: { type: GraphQLString },
        course_dayandtime: { type: GraphQLString },
        course_syllabus: { type: GraphQLString },
        course_term: { type: GraphQLString },
        course_instructor: { type: GraphQLString },
        total_enrollment: { type: GraphQLInt },
        course_capacity: { type: GraphQLInt },
        total_waitlist: { type: GraphQLInt },
        waitlist_capacity: { type: GraphQLInt },
        is_waitlist: { type: GraphQLBoolean }
    })
});

const signupResult = new GraphQLObjectType({
    name: 'signupResult',
    fields: () => ({
        success: { type: GraphQLBoolean },
        duplicateUser: { type: GraphQLBoolean }
    })
});

const loginResult = new GraphQLObjectType({
    name: 'loginResult',
    fields: () => ({
        result: { type: GraphQLBoolean },
        userData: { type: UserType }
    })
});

const profileResult = new GraphQLObjectType({
    name: 'profileResult',
    fields: () => ({
        userData: { type: UserType }
    })
});

const updateProfileResult = new GraphQLObjectType({
    name: 'updateProfileResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
})

const coursesResult = new GraphQLObjectType({
    name: 'coursesResult',
    fields: () => ({
        courses: { type: new GraphQLList(Course) }
    })
});

const createCourseResult = new GraphQLObjectType({
    name: 'createCourseResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: loginResult,
            args: {
                username: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                return new Promise(async (resolve, reject) => {
                    console.log("Resolve login: ", args)
                    connection.query('SELECT * FROM user WHERE email_id = ?', [args.username], function (error, results, fields) {
                        console.log(JSON.stringify(results))
                        if (results.length == 0) {
                            var result = {
                                result: false
                            }
                            resolve(result)
                        } else {
                            bcrypt.compare(args.password, results[0].password, function (err, res) {
                                if (res) {
                                    var result = {
                                        result: true,
                                        userData: results[0]
                                    }
                                    console.log(JSON.stringify(result))
                                    resolve(result)
                                }
                                else {
                                    var result = {
                                        result: false
                                    }
                                    resolve(result)
                                }
                            });
                        }
                    })
                })
            }

        },
        profile: {
            type: profileResult,
            args: {
                username: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                return new Promise(async (resolve, reject) => {
                    console.log("Resolve profile: ", args)
                    connection.query('SELECT * FROM user WHERE email_id = ?', [args.username], function (error, results, fields) {
                        console.log(JSON.stringify(results))
                        var result = {
                            result: true,
                            userData: results[0]
                        }
                        console.log(JSON.stringify(result))
                        resolve(result)
                    })
                })
            }

        },
        courses: {
            type: coursesResult,
            args: {
                username: {
                    type: GraphQLString
                },
                isStudent: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args) {
                return new Promise(async (resolve, reject) => {
                    console.log("Resolve courses: ", args)
                    console.log(args.isStudent);
                    if (args.isStudent === 1) {
                        var loggedInuser = args.username;
                        console.log(loggedInuser);
                        connection.query('select * from course join student_courses where course.course_uid = student_courses.course_uid ' +
                            'and student_courses.email_id = ?;', [loggedInuser], function (error, results, fields) {
                                console.log(JSON.stringify(results));
                                var result = {
                                    courses: results
                                }
                                resolve(result)

                            });
                    } else {
                        var loggedInuser = args.username;
                        console.log(loggedInuser);
                        connection.query('select * from course where created_by = ?;', [loggedInuser], function (error, results, fields) {
                            console.log(JSON.stringify(results));
                            var result = {
                                courses: results
                            }
                            resolve(result)
                        });
                    }
                    // connection.query('SELECT * FROM user WHERE email_id = ?', [args.username], function (error, results, fields) {
                    //     console.log(JSON.stringify(results))
                    //     var result = {
                    //         result: true,
                    //         userData: results[0]
                    //     }
                    //     console.log(JSON.stringify(result))
                    //     resolve(result)
                    // })
                })
            }

        }
    }
});

var count = 10;
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: signupResult,
            args: {
                firstName: {
                    type: GraphQLString
                },
                lastName: {
                    type: GraphQLString
                },
                emailId: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
                role: {
                    type: GraphQLString
                }
            },

            resolve: (parent, args) => {
                console.log("Signup resolve")
                console.log(JSON.stringify(args))
                return new Promise(async (resolve, reject) => {

                    bcrypt.hash(args.password, 10, function (err, hash) {
                        if (err) throw err;
                        password = hash;
                        connection.query('INSERT INTO user (email_id, first_name, last_name , password, is_student) VALUES (?,?,?,?,?);', [args.emailId, args.firstName, args.lastName, password, args.role === 'student'], function (error, results, fields) {
                            console.log(error);
                            console.log("---------------------------------------");
                            console.log(results);
                            if (error) {
                                var resultData = {
                                    success: false,
                                    duplicateUser: true
                                }
                                resolve(resultData);
                            } else {
                                var resultData = {
                                    success: true,
                                    duplicateUser: false
                                }
                                resolve(resultData);
                            }
                        });
                    });

                })
            }
        },
        updateProfile: {
            type: updateProfileResult,
            args: {
                username: { type: GraphQLString },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                about_me: { type: GraphQLString },
                country: { type: GraphQLString },
                city: { type: GraphQLString },
                gender: { type: GraphQLString },
                school: { type: GraphQLString },
                hometown: { type: GraphQLString },
                language: { type: GraphQLString },
                company: { type: GraphQLString }
            },
            resolve(parent, args) {
                console.log("Update profile resolve")
                console.log(JSON.stringify(args))
                return new Promise(async (resolve, reject) => {

                    connection.query('UPDATE user SET first_name = ?, last_name = ?, phone_number = ?,about_me = ?, city = ?, country =?, company = ?, school =?, hometown =?, languages =?,gender =? WHERE email_id = ?;',
                        [args.first_name, args.last_name, args.phone_number, args.about_me, args.city, args.country, args.company, args.school, args.hometown, args.languages, args.gender, args.username], function (error, results, fields) {
                            if (error) {
                                var resultData = {
                                    success: false
                                }
                                resolve(resultData);
                            } else {
                                var resultData = {
                                    success: true
                                }
                                resolve(resultData);
                            }
                        });
                })
            }
        },
        createCourse: {
            type: createCourseResult,
            args: {
                username: { type: GraphQLString },
                course_id: { type: GraphQLInt },
                course_name: { type: GraphQLString },
                course_dept: { type: GraphQLString },
                course_dept_code: { type: GraphQLString },
                course_desc: { type: GraphQLString },
                course_room: { type: GraphQLString },
                course_dayandtime: { type: GraphQLString },
                course_syllabus: { type: GraphQLString },
                course_term: { type: GraphQLString },
                course_instructor: { type: GraphQLString },
                course_capacity: { type: GraphQLInt },
                waitlist_capacity: { type: GraphQLInt },
            },
            resolve(parent, args) {
                console.log("Create course resolve")
                console.log(JSON.stringify(args))
                return new Promise(async (resolve, reject) => {
                    var loggedInuser = args.username;
                    connection.query('INSERT INTO course(course_id,course_term,course_name,course_dept,course_dept_code, ' +
                            'course_desc,course_room,course_capacity,waitlist_capacity,course_instructor,course_dayandtime,course_syllabus,created_by) ' +
                            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);', [args.course_id, args.course_term, args.course_name, args.course_dept, args.course_dept_code, args.course_desc, args.course_room, args.course_capacity, args.waitlist_capacity, args.course_instructor, args.course_dayandtime, args.course_syllabus, loggedInuser], function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    var resultData = {
                                        success: false
                                    }
                                    resolve(resultData);
                                } else {
                                    var resultData = {
                                        success: true
                                    }
                                    resolve(resultData);
                                }
                            });
                })
            }
        }
    }

});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});