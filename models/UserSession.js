const mongoose = require("mongoose")

const schema = mongoose.Schema({
	ip: String,
	email: String,
	cart: [{
		item: {
			type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory_Item'
		},
		item_size: String,
	}],
},{ collection : 'UserSessions' })

module.exports = mongoose.model("UserSession", schema)
