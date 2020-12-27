const mongoose = require("mongoose")

const schema = mongoose.Schema({
	brand: String,
  description: String,
	price: Number,
	discount_price: Number,
	sold_out: Boolean,
	category: String,
	image: String,
},{ collection : 'Inventory' })

module.exports = mongoose.model("Inventory_Item", schema)
