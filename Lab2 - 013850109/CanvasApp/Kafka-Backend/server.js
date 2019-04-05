var connection = require('./kafka/Connection');

var Login = require('./services/login');
var Signup = require('./services/signup');
var Account = require('./services/Account');
var UpdateAccount = require('./services/UpdateAccount');
var CourseDashboard = require('./services/CourseDashboard');
var CreateCourse = require('./services/CreateCourse');
var Permission = require('./services/Permission');
var CourseMetadata = require('./services/CourseMetadata');
var Course = require('./services/Course');

function handleTopicRequest(topic_name, function_name){

    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();

    console.log('server is running');
    consumer.on('message', function(message){
        console.log('message recieved for ' + topic_name + " " + function_name);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        function_name.handle_request(data.data, function(err, res){
            console.log('After request handling: ', res);
            var payload = [{
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId : data.correlationId,
                    data : res
                }),
                partition: 0
            }];

            producer.send(payload, function(err, data){
                console.log('Data: ', data);
            });
            return;

        });
    });
}

handleTopicRequest("login", Login);
handleTopicRequest("signup", Signup);
handleTopicRequest("account-details", Account);
handleTopicRequest("update-account", UpdateAccount);
handleTopicRequest("course-dashboard", CourseDashboard);
handleTopicRequest("create-course", CreateCourse);
handleTopicRequest("permission", Permission);
handleTopicRequest("course-metadata", CourseMetadata);
handleTopicRequest("course", Course);