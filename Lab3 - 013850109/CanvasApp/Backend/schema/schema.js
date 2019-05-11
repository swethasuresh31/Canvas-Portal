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
        phoneNo: {
            type: GraphQLString
        },
        aboutMe: {
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

// connection.query('SELECT * FROM user WHERE email_id = ?', [parent.username], function (error, results, fields) {
//     if (results.length == 0) {
//         return(JSON.stringify({
//             status: 404,
//             message: "Username does not exist!"
//         }))
//     } else {
//         bcrypt.compare(password, results[0].password, function (err, res) {
//             if (res) {
//                 if (results[0].is_student) {
//                     response.cookie('cookieS', username, { maxAge: 900000, httpOnly: false, path: '/' });
//                     req.session.user = username;
//                     response.writeHead(200, {
//                         'Content-Type': 'text/plain'
//                     })
//                     return(JSON.stringify({
//                         status: 200,
//                         message: "Student"
//                     }))
//                 } else {
//                     response.cookie('cookieF', username, { maxAge: 900000, httpOnly: false, path: '/' });
//                     req.session.user = username;
//                     response.writeHead(200, {
//                         'Content-Type': 'text/plain'
//                     })
//                     return(JSON.stringify({
//                         status: 200,
//                         message: "Faculty"
//                     }))
//                 }
//             }
//             else {
//                 return(JSON.stringify({
//                     status: 400,
//                     message: "Incorrect Password"
//                 }))
//             }
//         });
//     }


// const AuthorType = new GraphQLObjectType({
//     name: 'Author',
//     fields: ( ) => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         age: { type: GraphQLInt },
//         books: {
//             type: new GraphQLList(BookType),
//             resolve(parent, args){
//                 return _.filter(books, { authorId: parent.id });
//             }
//         }
//     })
// });

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
            
        }
        // book: {
        //     type: BookType,
        //     args: { id: { type: GraphQLID } },
        //     resolve(parent, args){
        //         return _.find(books, { id: args.id });
        //     }
        // },
        // author: {
        //     type: AuthorType,
        //     args: { id: { type: GraphQLID } },
        //     resolve(parent, args){
        //         return _.find(authors, { id: args.id });
        //     }
        // },
        // books: {
        //     type: new GraphQLList(BookType),
        //     resolve(parent, args){
        //         return books;
        //     }
        // },
        // authors: {
        //     type: new GraphQLList(AuthorType),
        //     resolve(parent, args){
        //         return authors;
        //     }
        // }
    }
});

var count = 10;
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //     addAuthor: {
        //         type: AuthorType,
        //         args: {
        //             name: { type: GraphQLString },
        //             age: { type: GraphQLInt },
        //             id:{ type: GraphQLID }
        //         },
        //         resolve(parent, args){
        //             let author ={
        //                 name: args.name,
        //                 age: args.age,
        //                 id: args.id
        //             };
        //             authors.push(author)
        //             console.log("Authors",authors);
        //             return author;
        //         }
        //     },

        //     addBook: {
        //         type: BookType,
        //         args: {
        //             name: { type: GraphQLString },
        //             genre: { type: GraphQLString },
        //             authorId: { type: GraphQLID },
        //         },
        //         resolve(parent, args){
        //             let book = {
        //                 name: args.name,
        //                 genre: args.genre,
        //                 authorId: args.authorId,
        //                 id:count++
        //             }
        //             books.push(book);
        //             return book;
        //         }
        //     }

        // }
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
        login: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                connection.query('SELECT * FROM user WHERE email_id = ?', [args.username], function (error, results, fields) {
                    if (results.length == 0) {
                        return null;
                    } else {
                        bcrypt.compare(args.password, results[0].password, function (err, res) {
                            if (res) {
                                const us = {
                                    emailId: "Swethasuresh@sjsu.edu"
                                }
                                console.log("Swethasuresh@sjsu.edu")
                                return (us)
                            }
                            else {
                                return null;
                            }
                        });
                    }
                })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});