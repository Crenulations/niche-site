const express = require("express")
const mongoose = require("mongoose")
const api_routes = require("../routes/api_routes")
const primary_routes = require("../routes/primary_routes")
const admin_routes = require("../routes/admin_routes")
const cookieParser = require("cookie-parser")

mongoose // MongoDB database connection which contains REST API
	.connect("mongodb://localhost:27017/PrimaryData", { useNewUrlParser: true })
	.then(() => {

		const app = express()

    // Set ejs view-engine
    app.set('views', 'rag-site/views')
    app.set('view engine', 'ejs')

		app.use(cookieParser());

    // Implement routes
		app.use("/admin", admin_routes)
		app.use("/api", api_routes)
		app.use("/", primary_routes)

		app.listen(3000, () => {
      console.log("Succesful connection to port 3000")
		})
	})

/* ========== TO-DO ==============

			--- MOST IMPORTANT ---
		- Secure the database
		- CRASH LOG!!!
		- Admin password
		- Payment Processing
		- 404 pages for front and admin panel

			--- MAIN SITE ----
		- Item view does not show multiple images

			--- CART ----
		- Order cart item by date added
		- Make cart items clickable
		- Add a function which tells you an item has been sold out of your cart

       --- MISC ---
		- Change alt tags on images
		- The middleware which loads unique brands fires on every request not just page requests,
				very inneficient.

			 --- ADMIN ---
		- Admin password
		- Select sizing options/availability in item creation.
		- Delete Image from item function
			- Images should be deleted from the uploads folder also
		- Admin mobile css is dogshit


https://docs.mongodb.com/manual/tutorial/model-data-for-keyword-search/

https://medium.com/javascript-in-plain-english/building-a-shopping-cart-in-node-js-bdbe02614eb9

https://softwareontheroad.com/nodejs-jwt-authentication-oauth/#requirements
USE THIS TO CLEAN/RESTRUCTURE: https://softwareontheroad.com/ideal-nodejs-project-structure#folder

https://wiki.c2.com/?PatternCommunity

*/
