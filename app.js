require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const mongoose = require('mongoose')
const main = require("./routes/main")
const admin = require("./routes/admin")
const expressEjsLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const passportSetuup = require("./config/passportSet")
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require("passport")

connectDB()


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())


app.set("view engine", "ejs")
app.use(expressEjsLayouts)
app.set("layout", "./layouts/main")


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static("public"))

app.use(passport.initialize())
app.use(passport.session())

app.use("/", admin)
app.use("/", main)

app.listen(4000, () => {
  console.log("listening")
})

