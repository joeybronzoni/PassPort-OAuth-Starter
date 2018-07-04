// Lib imports
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// Local imports
const keys = require('../config/keys');
// fetch the users we created out of mongoose (its a model class(look at gif))
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
	done(null, user);
  });
});


/*
	PP, I want you to be aware that there is a new strategy available
    We pass 2 important options to use the GoogleStrategy: a Client_Id, and a Secret which
	are provided from google-service. Link: https://console.developers.google.com

	-The access token would be used if we wanted to do anything with the users account
	like modifying some info or something, but we're not using it
*/

passport.use(
  new GoogleStrategy(
	{
	  clientID: keys.googleClientID,
	  clientSecret: keys.googleClientSecret,
	  callbackURL: '/auth/google/callback'
	},
	(accessToken, refreshToken, profile, done) => {
	  User.findOne({ googleId: profile.id})
		.then((existingUser) => {
		  existingUser ? done(null, existingUser) : new User({ googleId: profile.id})
			  .save()
			  .then(user => done(null, user));
		  // the promise right above will save the instance of record and save to the db
		});

	  /*console.log('accessToken: ', accessToken);
		console.log('refreshToken: ', refreshToken);
		console.log('profile: ', profile);*/
	}
  )
);


// ClientID/clientSecret:
/* ClientID:
   - Public token we can share this with the public

  clientSecret:
  - Private token we dohn't want anyone to see this. If someone else gets access to the clientSecret
    - they will have elevated access to everything

  */

// How email authentication and password  work:
/* Email & Passord Flow
   -Time-line: Signup(here's email/passwd), Signout, Login(here's email/passwd)
     - The identifying piece of information like the critical -security credential
   is the fact that you(the-user) is always giving us the same email and password
   again and again

   OAuth Flow:
   -Time-line:
     Signup(here's google-profile)(also-check if user exists already), Signout,
	 Login(here's google-profile -check if user exists)
     - Goes through the same oauth flow, the question is how do we know the user is the
	 exact same one that is signing in. *We do this by picking out some unique information
	 from the profile object to uniquely identify the user between signin attempts

   OAuth Flow-Full:
     Sign me up(here's google-profile, our server(take record and record in DB),
     reach to mongoDb(create new user record), back to our server(here's a cookie),
     Set-Cookie(send to users browser), user Logs-out(unset/expire cookie), User comes back
     and logs in with google button, {repeat google-oauth-flow}, back to our server with the
     profile, we take profile and instead of making new record in DB check to see if
     user exists with google-id(from the profile obj), confirm user was here before and
     Set-Cookie

   -BottomLine:
     - the purpose of googleOauth is to give us this one tiny identifying
	 token(just the google id for this app)
*/

// Mongoose:
/* See mongoose.gif
   -One Mongoose Model Class is eqaul to One MongoDB collection
   -One Mongoose Model Instance is equal to One individual record in MongoDB
   -Mongodb will be hosted remotely with the following directions
     Mlab.com, sign in:
     username: joeybronzoni passwd: you know it
	 1)createnew button
	 2)pick platform: AWS Free
	 3) select region to host in: US EAST
	 4) Name db: survey-emailer-dev
	 5) submit order
	 Next-
	 6)navigate to the new db:
	   -create database user:
	     username: joey, passwd: you knowit
   -
*/




// Change if to ternary:

/*

passport.use(
  new GoogleStrategy(
	{
	  clientID: keys.googleClientID,
	  clientSecret: keys.googleClientSecret,
	  callbackURL: '/auth/google/callback'
	},
	(accessToken, refreshToken, profile, done) => {
	  User.findOne({ googleId: profile.id}).then((existingUser) => {
		if (existingUser) {

		  done(null, existingUser);
		} else {

		  new User({ googleId: profile.id })
			.save()
			.then(user => done(null, user));
		}
	  });

	})
);
*/
