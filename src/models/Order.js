const mongoose = require("mongoose")

const schema = mongoose.Schema({
	user_id: String,
	email: String,
	items: [{type: String}],
	total: Number,
	payed: Boolean,
	shipped: Boolean,

	date_created: Date,
	date_shipped: Date,
},{ collection : 'Orders' })

module.exports = mongoose.model("Order", schema)
