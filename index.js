require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// function to protect routes
function ensureAuthenticated(req, res, next) {
  // check authentication
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }
  // denied. redirect to login
  res.redirect("/");
}

// set up passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    // function to handle the data Google sends back
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

// serialize the user information in the session
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

// deserialize the user information from the session
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Create a new Express application.
var app = express();

// Middleware to set up the session and cookie parser
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get("/", function(req, res) {
  // check for users information int he passport session and display it
  if (req._passport.session && req._passport.session.user) {
    let user = req._passport.session.user;
    res.send(
      `Logged in as ${user.displayName} (${
        user.emails[0].value
      }). <a href="/logout">Logout?</a> or visit a <a href="/protected">Protected Url?</a>`
    );

    // no one logged in
  } else {
    res.send(`Not logged in. <a href="/auth/google">Login?</a>`);
  }
});

// loggin out simply involves removing the passport session token
app.get("/logout", (req, res) => {
  req.logout();
  req._passport.session = null;
  res.redirect("/");
});

// this is the url we send to user to to start the authentication process
// we also specify what scope of information we want back
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// this is the url that Google will return our user to
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// protect a url
app.get("/protected", ensureAuthenticated, function(req, res) {
  let user = req._passport.session.user;
  res.send(
    `User profile for ${user.displayName} (${
      user.emails[0].value
    }). <a href="/">Home</a> - <a href="/logout">Logout?</a>`
  );
});

// start the server
app.listen(3000, () => {
  console.log("Example app listening on port 3000 http://localhost:3000!");
});
