const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")

const SiteServices = require("./SiteServices")


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
