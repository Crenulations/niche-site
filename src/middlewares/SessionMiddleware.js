const SiteServices = require("../services/SiteServices")
const UserServices = require("../services/UserServices")


/*  https://stackoverflow.com/questions/54176924/nodejs-distinguishing-http-requests-multiple-devices-with-same-public-ip
                     ^^^ Express fingerprinting implementation (TBD) ^^^     */

exports.validateUserSession = async (req, res, next) => {
  var session

  console.log("VALIDATING USER CONNECT: "+req.url)
  console.log("COOKIE:  "+req.cookies.user_id)

  // If no cookie
  if(req.cookies.user_id == undefined){
    console.log("EMPTY COOKIE ROUTE")
    // Check for dead sessions
    session = await UserServices.checkDeadSessions(req.connection.remoteAddress)
    // If there is no dead sessions create new session
    if(session == null){
      session = await newUserSession(res, req.connection.remoteAddress)
    }

  // If cookie
  }else{
    console.log("COOKIE FOUND")
    session = await UserServices.findUserById(req.cookies.user_id)
    console.log(session)
    // If no session by that ID
    if (session == null) {
      session = await newUserSession(res, req.connection.remoteAddress)

    // Remove new flag on second connection when cookie is confirmed to have been received
    } else if (session.new == true) {
      session.new = false
      session.save()
    }
  }

  req.session = session

  // Should be seperate middleware
  var cart_num = req.session.cart.length
  var brands = await SiteServices.getBrandsList()
  res.locals = {
    cart_num: cart_num,
    brands: brands,
    animation: false,
  }

  next()   // Middleware does 1 DB pull and 2 checks per normal connection
}

async function newUserSession(res, ip){
  session = await UserServices.newUserSession(ip)
  res.cookie('user_id', session._id, {
    maxAge: 31556926000,
    httpOnly: true,
  })
  return session
}
