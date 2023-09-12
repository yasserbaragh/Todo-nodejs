const express = require("express")
const passport = require("passport")
const jwt = require('jsonwebtoken')


const {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getGoogle,
    getHome
} = require("../controllers/adminController")

const router = express.Router()

const adminMid = (req,res,next) => {
  const token = req.cookies.token

  if(token) {
    const verifiedToken = jwt.verify(token, process.env.SECRET)
    if(verifiedToken) {
      res.redirect("/home")
      next()
    }
  }
  next()
}

router.route("/").get(adminMid, getHome)

router.route("/register").get(adminMid, getRegister).post(postRegister)
router.route("/login").get(adminMid, getLogin).post(postLogin)

router.get("/auth/facebook", adminMid, 
  passport.authenticate('facebook', 
  { authType: 'reauthenticate', 
  scope: ['profile'] 
}
))

router.get('/auth/google', adminMid, 
  passport.authenticate('google', 
  { scope: ['profile', "email"] }
  )
)

router.get("/auth/google/redirect",adminMid, passport.authenticate("google") ,getGoogle)

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
    }
    res.clearCookie("token")
    res.redirect("/")
  })
})
module.exports = router