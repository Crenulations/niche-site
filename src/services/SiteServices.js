const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")

exports.getBrandsList = async () => {
  return await Inventory_Item.distinct("brand").exec()
}

exports.getFullInventory = async () => {
  return await Inventory_Item.find().exec()
}

exports.getInventoryByID = async (id) => {
  return await Inventory_Item.findById(id).exec()
}

exports.getInventoryBySale = async () => {
  return await Inventory_Item.find({sale: { $ne : }}).exec()
}

exports.getInventoryByBrand = async (brand) => {
  return await Inventory_Item.find({brand: brand}).exec()
}

exports.getInventoryByCategory = async (category) => {
  return await Inventory_Item.find({category: category}).exec()
}
