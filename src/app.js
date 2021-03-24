const express = require("express")
const mongoose = require("mongoose")
const https = require("https")
const http = require("http")
const api_routes = require("./routes/api_routes.js")
const primary_routes = require("./routes/primary_routes.js")
const admin_routes = require("./routes/admin_routes.js")
const stripe_routes = require("./routes/stripe_routes.js")
const fs = require('fs');


mongoose // MongoDB database connection which contains REST API
	.connect("mongodb://localhost:27017/PrimaryData", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {

		// Load HTTPS cert if in live mode
		const args = process.argv.slice(2)
		if (args[0] === 'live'){
			console.log('Path of file in parent dir:', require('path').resolve(__dirname, '../app.js'));
			var privateKey = fs.readFileSync('./key.pem','utf8');
			var certificate = fs.readFileSync('./cert.pem','utf8');
			var credentials = {key: privateKey, cert: certificate};
		}

		var app = express();

    // Set ejs view-engine
    app.set('views', 'niche-site/views')
    app.set('view engine', 'ejs')

    // Implement routes
		app.use("/admin", admin_routes)
		app.use("/api", api_routes)
		app.use("/stripe", stripe_routes)
		app.use("/", primary_routes)

		// Create HTTP or HTTPS connection
		if (args[0] === 'live'){
			var httpsServer = https.createServer(credentials, app);
			httpsServer.listen(443);
			console.log("Succesful HTTPS connection on port 443")
			console.log("LIVE MODE")
		} else {
			var httpServer = http.createServer(app);
			httpServer.listen(80);
			console.log("Succesful HTTP connection on port 80")
			console.log("TEST MODE")
		}

	})

/* ========== TO-DO ==============

			--- MOST IMPORTANT ---
		- Error with Stripe webhooks
		- Items should be checked for availability before adding to cart and before checkout
		- Activate stripe shipping address
		-	No cart duplicates
		- Add handling for rejected orders on Stripe webhooks (send an email)
		- desktop safari messes up animation
		- Database authentication
		- Load stripe secrets, admin passwords, and database auth from seperate file not kept on github

			--- MAIN SITE ----
		- Expand category system to have multiple categories
		- Item view does not show multiple images
		- Page Titles
		- Add function to make Animation only happen once a day.

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
