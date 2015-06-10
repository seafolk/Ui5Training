var express = require('express')
var path = require('path');
var app = express()

app.use('/', express.static(__dirname + '/public'));
app.use('/sdk',express.static(path.normalize(__dirname + "/../sdk")));

app.listen(3000)

console.log("Server start localhost:3000")
