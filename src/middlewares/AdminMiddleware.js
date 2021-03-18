const AdminServices = require("../services/AdminServices")

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

exports.validateAdminLogin = async (req, res, next) => {
  let cookie = req.cookies.admin_login
  console.log("VALIDATING ADMIN LOGIN")

  if(cookie){

    var split = cookie.split("|")
    let username = split[0]
    let password = split[1]
    let auth = await AdminServices.checkLogin(username, password)

    if(auth){
      next()
    }else{
      res.redirect('/admin/login')
    }

  }else{
    res.redirect('/admin/login')
  }
}
