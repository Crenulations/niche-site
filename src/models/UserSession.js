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

 // Used to identify connections refusing cookies
	new: {type:Boolean, default:true},
	dead: {type:Boolean, default:false},

},{ collection : 'UserSessions' })

module.exports = mongoose.model("UserSession", schema)
