var express = require("express");
var router = express.Router();

var multer = require("multer");
var upload = multer({ dest: "data/" });

var xlsx = require("node-xlsx");


function handleUpload(req, res, next){
  var datasetId = req.file.filename;

  // Parse a file
  var worksheets = xlsx.parse('data/' + datasetId);

  res.status(200).send(worksheets);
}


// uploader
router.post('/upload', upload.single('userData'), handleUpload);


// index
router.get('/', function(req, res) {
  res.render('index');
});


module.exports = router;
