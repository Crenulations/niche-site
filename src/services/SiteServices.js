const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")
const Order = require("../models/Order")

const UserServices = require("./UserServices")

// --------- MISC
exports.getBrandsList = async () => {
  return await Inventory_Item.distinct("brand").exec()
}

// --------- INVENTORY
exports.getFullInventory = async () => {
  return await Inventory_Item.find().exec()
}
exports.getAvailableInventory = async () => {
  return await Inventory_Item.find({sold_out: false}).exec()
}
exports.getInventoryByID = async (id) => {
  return await Inventory_Item.findById(id).exec()
}
exports.getInventoryBySale = async () => {
  return await Inventory_Item.find({sale: { $ne: "discount"}}).exec()
}
exports.getInventoryByBrand = async (brand) => {
  return await Inventory_Item.find({brand: brand, sold_out: false}).exec()
}
exports.getInventoryByCategory = async (category) => {
  return await Inventory_Item.find({category: category, sold_out: false}).exec()
}
exports.selloutInventory = async (id) => {
  let item = await exports.getInventoryByID(id)
  item.sold_out = true;
  item.save()
}


exports.createOrder = async (id) => {
  const userSession = await UserServices.findUserById(id)
  const cart_pack = await UserServices.getOrderInfo(id)
  const total = cart_pack.total*100
  const order = new Order({
    user_id: id,
  	items: cart_pack.cart,
  	total: total,
  	payed: false,
  	shipped: false,
  })
  await order.save()
  return order
}
exports.getOrderByID = async (id) => {
  return await Order.findById(id).exec()
}
