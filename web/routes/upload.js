var express = require("express");
var router = express.Router();
var path = require("path");

var xlsx = require("node-xlsx");
var uploader = require("../config/uploader");

// uploader
router.post('/upload', uploader.single('userData'), function (req, res, next){
  res.status(200).send( xlsx.parse( path.join(__dirname, "../data", req.file.filename) ) );
});

// index
router.get('/', function(req, res) {
  res.render('upload', {uploadUrl: "/carga/upload"});
});

module.exports = router;
