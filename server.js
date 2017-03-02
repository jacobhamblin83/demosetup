const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0').Strategy;
const session = require('express-session');
const config = require('./config.js')

const app = express();

app.use(session({
    secret: config.secret
}))

app.use(passport.initialize())

app.use(passport.session())

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientId,
  clientSecret: config.auth0.clientSecret,
  callbackURL: '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}),
  function(req, res) {
  res.status(200).send(req.user);
  })

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/me', function(req, res){
    res.status(200).send(req.user)
})


app.listen(3000, function(){
    console.log('listening on port 3000')
})