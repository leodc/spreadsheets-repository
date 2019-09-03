// Dependencies
var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var bodyParser = require("body-parser");
var io = require("socket.io")(http);
var mongo = require("./config/mongo");

// setup
app.use(express.static(path.join(__dirname, "client")));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routers
var cargaRouter = require("./routes/upload.js");
var indexRouter = require("./routes/index.js");
var personsRouter = require("./routes/persons.js");

app.use("/carga", cargaRouter);
app.use("/", indexRouter);
app.use("/persona", personsRouter);


io.on("connection", function(socket){
  mongo.getTotalPersons(function(err, count){
    socket.emit("totalPersons", count);
  });

  socket.on("nameList", mongo.getNameList);
  socket.on("search", mongo.searchPersonsByNames);
  socket.on("getPerson", mongo.getPerson);
});

// socket
io.of("/carga").on("connection", function(socket){

  socket.on("insertPersons", mongo.insertPersonsArray);
  socket.on("getMatches", mongo.getArrayMatches);

});

// start
http.listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
