const mongoose = require("mongoose")

const Inventory_Item = require("../models/Inventory_Item")
const UserSession = require("../models/UserSession")

const SiteServices = require("./SiteServices")


exports.newUserSession = async (ip) => {
  var session = await new UserSession()
  session.ip = ip;
  await session.save()

  return session
}

exports.findUserById = async (id) => {
  var session
  try{
    session =  await UserSession.findById(mongoose.Types.ObjectId(id)).exec()
  }catch(err){
    console.log("FIND USER ERROR $%^$%$")
    session = undefined
  }
  return session
}

exports.getUserCart = async (id) => { // Returns both cart and total together as object
  const user = await UserSession.findById(id).exec()

  var cart = []
  var total = 0

  for (i = 0; i < user.cart.length; i++) {

    let entry = user.cart[i]
    let item = await SiteServices.getInventoryByID(entry.item)

    //This checks if item has been deleted but it should also check if is sold out.
    if (item == null) {
      user.cart.splice(i, 1)
      await user.save();
    } else {
      if (item.discount_price != null) {
        total += item.discount_price
      } else {
        total += item.price
      }
      cart.push({item: item, size: entry.item_size})
    }
  }
  total = total.toFixed(2)
  console.log(total)
  return {cart: cart, total: total}
}

exports.addItemToCart = async (id, item_id, item_size) => {
  let session = await UserSession.findById(id).exec()
  session.cart.push({
    item: item_id,
    item_size: item_size,
  })
  await session.save()
}

exports.removeItemFromCart = async (id, cart_num) =>{
  console.log("YOOOO")
  let session = await UserSession.findById(id).exec()
  session.cart.splice(cart_num, 1)
  session.save()
}

exports.addEmail = async (id, email) => { // This ideally should scrub input for security
  if(id){
    let session = await UserSession.findById(id).exec()
    session.email = email
    session.save()
  }
}

exports.checkDeadSessions = async (ip) => {
  var session = await UserSession.findOne({'ip':ip,'dead':true}).exec()

  if (session) {
    return session
  } else {
    var unconfirmed_sessions = await UserSession.find({'ip':ip,'new':true}).exec()

    if(unconfirmed_sessions && unconfirmed_sessions.length >= 3){
      session = unconfirmed_sessions[0]
      await unconfirmed_sessions[1].delete()
      await unconfirmed_sessions[2].delete()

      session.dead = true
      await session.save()

      return session
    }else{
      return null
    }
  }
}
