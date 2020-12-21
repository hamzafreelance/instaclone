const multer = require('multer');
const fs = require('fs');


module.exports = (path, fileName) => {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, path)
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname )
      }
      });
      return storage;
}
