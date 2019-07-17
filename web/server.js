// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var bodyParser = require("body-parser");


// setup
app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// routers
var indexRouter = require("./routes/index.js");

app.use("/", indexRouter);

// start
http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
