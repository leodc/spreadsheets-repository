var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../data") );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage: storage });
