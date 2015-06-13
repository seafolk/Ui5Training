var express = require('express');
var path = require('path');
var config = require('./config.json');

var app = express();

app.use('/resources', express.static(path.normalize(__dirname + config.resources_path)));
app.get("/config.json", function(req, res) {
    res.format({
        'application/json': function() {
            res.send(config);
        }
    });
});

// Add modules
app.use('/courses', express.static(__dirname + '/courses'));

app.listen(3000);

console.log("Server start localhost:3000");
