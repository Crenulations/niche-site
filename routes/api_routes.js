const express = require("express")
const router = express.Router()

router.use(express.json()); // to support JSON-encoded bodies
router.use(express.urlencoded()); // to support URL-encoded bodies

// This router is used for POST requests


module.exports = router
