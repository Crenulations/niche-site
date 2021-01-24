const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")

const SiteServices = require("./SiteServices")


exports.getUserByID = async (id) => {
  return await UserSession.findById(id).exec()
}

exports.getUserCart = async (id) => { // Returns both cart and total together as object
  const user = await module.exports.getUserByID(id)

  var cart = []
  var total = 0

  for (i = 0; i < user.cart.length; i++) {

    let entry = user.cart[i]
    let item = await SiteServices.getInventoryByID(entry.item)

    //This checks if item has been deleted but it should also check if is sold out.
    if (item == null) {
      user.cart.splice(i, 1)
      user.save();
    } else {
      if (item.discount_price != null) {
        total += item.discount_price
      } else {
        total += item.price
      }
      cart.push({item: item, size: entry.item_size})
    }
  }
  return {cart: cart, total: total}
}


exports.newUserSession = async () => {
  var session = new UserSession()
  session.ip = req.connection.remoteAddress;
  session.save()

  return session
}
