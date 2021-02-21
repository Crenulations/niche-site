const mongoose = require("mongoose")

const schema = mongoose.Schema({
	brand: String,
  description: String,
	single_size: String,
	price: Number,
	discount_price: Number,
	sold_out: Boolean,
	category: String,
	minor_descriptions: [{type: String}],
	images: [{type:String}],
	category: String,
},{ collection : 'Inventory' })

module.exports = mongoose.model("Inventory_Item", schema)
