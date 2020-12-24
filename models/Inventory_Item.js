const mongoose = require("mongoose")

const schema = mongoose.Schema({
	title: String,
  start_date: Date,
	end_date: Date,
	color: String,
	link: String,
},{ collection : 'CalendarEvents' })

module.exports = mongoose.model("CalendarEvent", schema)
