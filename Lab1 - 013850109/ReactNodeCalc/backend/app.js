var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());


app.post('/add', function (req, res) {
  var left = parseFloat(req.body.left);
  var right = parseFloat(req.body.right);
  console.log(left + " + " + right);
  res.send({result : left+right});
});
app.post('/subtract', function (req, res) {
  var left = parseFloat(req.body.left);
  var right = parseFloat(req.body.right);
  console.log(left + " - " + right);
  res.send({result : left-right});
});
app.post('/multiply', function (req, res) {
  var left = parseFloat(req.body.left);
  var right = parseFloat(req.body.right);
  console.log(left + " * " + right);
  res.send({result : left*right});
});
app.post('/divide', function (req, res) {
  var left = parseFloat(req.body.left);
  var right = parseFloat(req.body.right);
  console.log(left + " / " + right);
  res.send({result : left/right});
  });


var server = http.createServer(app);
console.log("Listening on port : " + 3001)
server.listen(3001);

module.exports = app;
