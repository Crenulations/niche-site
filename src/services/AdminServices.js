const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")
const Order = require("../models/Order")

const SiteServices = require("./SiteServices")
const StripeServices = require("./StripeServices")

const bcrypt = require('bcrypt')


exports.getAllOrders = async () => {
  return await Order.find().exec()
}

exports.deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id).exec()
}

exports.getAllUserSessions = async () => {
  return await UserSession.find().exec()
}

exports.deleteUserSession = async (id) => {
  await UserSession.findByIdAndDelete(id).exec()
}

exports.newInventoryItem = async () => {
  const item = new Inventory_Item({
    brand: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    minor_descriptions: [],
    sold_out: false,
    images: [],
  })
  await item.save()
  return item
}

exports.addImageToItem = async (id, img_url) => {
  var item = await SiteServices.getInventoryByID(id)
  item.images.push("" + img_url)
  item.save()
}

exports.deleteImage = async (id, num) => {
  var item = await SiteServices.getInventoryByID(id)
  item.images.splice(num,1)
  item.save()
}

exports.updateInventoryItem = async (id, req) => {
  var item = await SiteServices.getInventoryByID(id)

  item.brand = req.body.brand
  item.description = req.body.description
  item.price = req.body.price
  item.single_size = req.body.single_size
  item.discount_price = req.body.discount_price
  item.category = req.body.category
  // Load the minor Descriptions
  var minor_descs = []
  for (i = 0; i > -1; i++) {
    var desc = req.body["minor_description_" + i]
    if (desc == undefined || desc == null)
      break;
    else if (desc != "")
      minor_descs.push(desc)
  }
  item.minor_descriptions = minor_descs,
  item.save()
}

exports.deleteInventoryItem = async (id) => {
  await Inventory_Item.findByIdAndDelete(id).exec()
}

exports.login = async (req, res) => {

  const username = req.body.username
  const password = req.body.password

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  let auth = await exports.checkLogin(username, hash)

  if(auth == true){
    console.log(hash)

    let cookie = ""+username+"|"+hash
    res.cookie('admin_login', cookie, {
      maxAge: 31556926000,
      httpOnly: true,
    })
    console.log("SUCCESS")
    res.redirect('/admin/inventory/')
  }else{
    console.log("FAILURE")
    res.redirect('/admin/bad_login')
  }
}

exports.checkLogin = async (username,passwordHash) => {
  if(username === "bootymanz"){
    let isSame = await bcrypt.compare("1234", passwordHash)
    return isSame
  }
}
