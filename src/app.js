const express = require("express")
const mongoose = require("mongoose")
const api_routes = require("./routes/api_routes.js")
const primary_routes = require("./routes/primary_routes.js")
const admin_routes = require("./routes/admin_routes.js")
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')

mongoose // MongoDB database connection which contains REST API
	.connect("mongodb://localhost:27017/PrimaryData", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {

		const app = express()

    // Set ejs view-engine
    app.set('views', 'niche-site/views')
    app.set('view engine', 'ejs')

		app.use(cookieParser());
		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded({ extended: true }))

    // Implement routes
		app.use("/admin", admin_routes)
		app.use("/api", api_routes)
		app.use("/", primary_routes)

		app.listen(80, () => {
      console.log("Succesful connection to port 80")
		})
	})

/* ========== TO-DO ==============

			--- MOST IMPORTANT ---
		- MAJOR GLITCH: desktop safari messes up animation
		- Database auth file
		- Admin auth
		- connecting to the success page should clear the cart

			--- MAIN SITE ----
		- Expand category system to have multiple categories
		- Item view does not show multiple images
		- Page Titles
		- Add function to make Animation happen once a day.

			--- CART ----
		- Order cart item by date added
		- Make cart items clickable
		- Add a function which tells you an item has been sold out of your cart

       --- MISC ---
		- Breadcrumb
		- Change alt tags on images

			 --- ADMIN ---
		- Select sizing options/availability in item creation.
		- Delete Image from item function
			- Images should be deleted from the uploads folder also

https://docs.mongodb.com/manual/tutorial/model-data-for-keyword-search/

https://medium.com/javascript-in-plain-english/building-a-shopping-cart-in-node-js-bdbe02614eb9

https://softwareontheroad.com/nodejs-jwt-authentication-oauth/#requirements
USE THIS TO CLEAN/RESTRUCTURE: https://softwareontheroad.com/ideal-nodejs-project-structure#folder

https://wiki.c2.com/?PatternCommunity

*/
