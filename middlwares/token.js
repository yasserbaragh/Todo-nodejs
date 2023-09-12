const jwt = require('jsonwebtoken')
const User = require("../models/userSchema")
require("dotenv").config()

const tokenMiddlware = async (req,res,next) => {
    const token = req.cookies.token

    if (!token) {
        return res.redirect("/")
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.SECRET)
        req.userId = verifiedToken.userId
        req.user = await User.findOne({ _id: req.userId }).select("-password")
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "uno" })
    }
}

module.exports = tokenMiddlware