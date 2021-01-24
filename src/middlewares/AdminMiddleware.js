const {v1: uuidv1} = require('uuid');
const multer = require("multer")

exports.multerStorage = multer.diskStorage({
  destination: "uploads",
  filename: function(req, file, cb) {
    let uid = uuidv1() + ".jpg";
    req.img_url = uid;
    cb(null, uid);
  }
})

exports.multerUpload = multer({
  storage: module.exports.multerStorage
})
