var assert = require('chai').assert;
var app = require('../index');

var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);


describe('Canvas-Application', function () {

    it('POST /login', function () {
        //this.timeout(50000);

        agent.post('/login')
            .send({
                username: 'student1',
                password: 'student1'
            })
            .then(function (res) {
                assert.equal(res.status, 200);

            });
    });

    it('GET /UserCourse', function () {
        //this.timeout(50000);
        let user= 'student@sjsu.edu';
        agent.get('/usercourse/'+user)
        .set('Authorization', 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6MCwiZW1haWxJZCI6ImZhY3VsdHlAc2pzdS5lZHUiLCJuYW1lIjoiUHJvZmVzc29yIEZhY3VsdHkiLCJyb2xlIjoiZmFjdWx0eSIsInBob25lTm8iOiIxMjM0NTY3ODkiLCJhYm91dE1lIjoiIiwiY2l0eSI6IiIsImNvdW50cnkiOiIiLCJjb21wYW55IjoiIiwic2Nob29sIjoiIiwiaG9tZXRvd24iOiIiLCJsYW5ndWFnZXMiOiIiLCJnZW5kZXIiOiIifSwiaWF0IjoxNTU1MjMxODA0LCJleHAiOjE1NTUyNDE4ODR9.xE8MNSBlliSf4vYAev0BTruXAfz0d4VVzWUcGxVlfOY')
        .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /SearchCourse', function () {
        //this.timeout(50000);
        agent.get('/coursemetadata')
        .set('Authorization', 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6MCwiZW1haWxJZCI6ImZhY3VsdHlAc2pzdS5lZHUiLCJuYW1lIjoiUHJvZmVzc29yIEZhY3VsdHkiLCJyb2xlIjoiZmFjdWx0eSIsInBob25lTm8iOiIxMjM0NTY3ODkiLCJhYm91dE1lIjoiIiwiY2l0eSI6IiIsImNvdW50cnkiOiIiLCJjb21wYW55IjoiIiwic2Nob29sIjoiIiwiaG9tZXRvd24iOiIiLCJsYW5ndWFnZXMiOiIiLCJnZW5kZXIiOiIifSwiaWF0IjoxNTU1MjMxODA0LCJleHAiOjE1NTUyNDE4ODR9.xE8MNSBlliSf4vYAev0BTruXAfz0d4VVzWUcGxVlfOY')
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /Announcement', function () {
        //this.timeout(50000);
        let announcementUid= 1;
        agent.get('/announcement/'+announcementUid)
        .set('Authorization', 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6MCwiZW1haWxJZCI6ImZhY3VsdHlAc2pzdS5lZHUiLCJuYW1lIjoiUHJvZmVzc29yIEZhY3VsdHkiLCJyb2xlIjoiZmFjdWx0eSIsInBob25lTm8iOiIxMjM0NTY3ODkiLCJhYm91dE1lIjoiIiwiY2l0eSI6IiIsImNvdW50cnkiOiIiLCJjb21wYW55IjoiIiwic2Nob29sIjoiIiwiaG9tZXRvd24iOiIiLCJsYW5ndWFnZXMiOiIiLCJnZW5kZXIiOiIifSwiaWF0IjoxNTU1MjMxODA0LCJleHAiOjE1NTUyNDE4ODR9.xE8MNSBlliSf4vYAev0BTruXAfz0d4VVzWUcGxVlfOY')
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });

    it('GET /Messages', function () {
        //this.timeout(50000);
        let user= 'student1';
        let courseUid = 1;
        agent.get('/message/inbox')
        .set('Authorization', 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6MCwiZW1haWxJZCI6ImZhY3VsdHlAc2pzdS5lZHUiLCJuYW1lIjoiUHJvZmVzc29yIEZhY3VsdHkiLCJyb2xlIjoiZmFjdWx0eSIsInBob25lTm8iOiIxMjM0NTY3ODkiLCJhYm91dE1lIjoiIiwiY2l0eSI6IiIsImNvdW50cnkiOiIiLCJjb21wYW55IjoiIiwic2Nob29sIjoiIiwiaG9tZXRvd24iOiIiLCJsYW5ndWFnZXMiOiIiLCJnZW5kZXIiOiIifSwiaWF0IjoxNTU1MjMxODA0LCJleHAiOjE1NTUyNDE4ODR9.xE8MNSBlliSf4vYAev0BTruXAfz0d4VVzWUcGxVlfOY')
             .then(function (res) {
                assert.equal(res.status, 200);
            });
    });


})