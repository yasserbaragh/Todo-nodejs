const user = require("../models/userSchema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const adminLayout = "../views/layouts/admin"

const jwtToken = process.env.SECRET

const getHome = async(req,res) => {
    locals = {
        title: "HomePage",
        description: "this is the homepage"
    }

    res.render("home", {locals, layout: adminLayout})
}

const getRegister = async (req,res) => {
    const locals = {
        title: "Register"
    }

    const error = req.query.error

    res.render("register", {locals, error, layout: adminLayout})
}

const postRegister =  async (req,res) => {
    const { username, email, password } = req.body
    const usernameUsed = username.toLowerCase()
    const locals = {
        title: "Register"
    }

    try {
        if(!username) {
            return res.redirect("/register?error=username required")
        }
        if(!validator.isEmail(email)) {
            return res.redirect("/register?error=not a valid email")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const isStrongPassword = validator.isStrongPassword(password)
        if(!isStrongPassword) {
            return res.redirect("/register?error=not a strong password")
        }
        
        const User = await user.create({username: usernameUsed, email, password: hashedPassword})

        const token = jwt.sign({userId: User._id}, jwtToken)
        res.cookie("token", token, {httpOnly: true, expiresIn: "1d"})
        res.redirect("/home")

        res.render("register", {locals, layout: adminLayout})
    }catch(error) {
        if(error.code === 11000) {
            if (error.keyPattern.username === 1) {
                return res.redirect("/register?error=username already exists")
              } else if (error.keyPattern.email === 1) {
                return res.redirect("/register?error=email already used")
              }
        }
        res.status(400).json({message: error})
    }
   
}

const getLogin = async (req,res) => {
    const error = req.query.error
    res.render("login", { error, layout: adminLayout})
}

const postLogin =  async (req,res) => {
    const { usernameOrEmail, password } = req.body
    const usernameOrEmailUsed = usernameOrEmail.toLowerCase()
    const locals = {
        title: "Login"
    }

    try {
        
        const User = await user.findOne({
            $or: [
                { username: usernameOrEmailUsed },
                { email: usernameOrEmail }
            ]
        })

        if(!User) {
            return res.redirect("/login?error=invalid incredentials")
        }

        const authUser = await bcrypt.compare(password, User.password)
        if(!authUser) {
            return res.redirect("/login?error=invalid incredentials")
        }

        const token = jwt.sign({userId: User._id}, jwtToken)
        res.cookie("token", token, {httpOnly: true, expiresIn: '1d' })
        res.redirect("/")

        res.render("login", {locals, layout: adminLayout})
    }catch(error) {
        return res.redirect(`/login?error=All fields are required`)
    }
   
}

const getGoogle = (req,res) => {
    const token = jwt.sign({userId: req.user._id}, jwtToken)
    res.cookie("token", token, {httpOnly: true, expiresIn: '1d' })
    res.redirect("/home")
}


module.exports = { 
    getHome,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getGoogle
}