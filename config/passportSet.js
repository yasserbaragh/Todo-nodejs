const passport = require("passport")
//const FbSt = require("passport-facebook")
const GoogleSt = require("passport-google-oauth20")
const User = require("../models/userSchema")
const jwt = require("jsonwebtoken")
require("dotenv").config()

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

/*passport.use(new FbSt({
        clientID: process.env.APP_ID ,
        clientSecret: process.env.FB_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }, () => {
        //
    })
)*/

passport.use(new GoogleSt({
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/redirect"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile.emails[0].value}).then(current => {
        if(current) {
            done(null, current)
        } else {
            const newUser = new User({
                username: profile.emails[0].value,
                email: profile.emails[0].value,
                img: profile._json.picture
            })
            
            newUser.save()
                .then((user) => {
                    done(null, user)
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }) 
  }
))