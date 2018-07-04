// Lib inports
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

// Local imports
const keys = require('./config/keys');

require('./models/User'); // make sure the User model is run before the passport is run
require('./services/passport');

// mongoose connection:
// mlab remote connection:
mongoose.connect(keys.mongoURI);

// local connection:
// mongoose.connect(keys.localMongoURI);

const app = express();

// Enable cookies
app.use(
  cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [keys.cookieKey]
  })
);

// tell PP to use cookies
app.use(passport.initialize());
app.use(passport.session());



// authRoutes handlers
require('./routes/authRoutes')(app);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Express running on PORT, ${PORT}`);
});


// Notes:
/* Reffered to commonJS modules- a system implemented in nodejs for requiring/sharing code
between different files, node does not have support for ES6 modules but on the front end we
will use import-from syntax*/

// Refactoring
/*
 const authRoutes = require('./routes/authRoutes'); and authRoutes(app);
 gets refactored to this require('./routes/authRoutes')(app);

  const passportConfig = require('./services/passport');
  becomes require('./services/passport');

*/

/* OATH & Passport
   -refer to OATH-flow.gif in diagrams
   -2 Complaints that people have for Passport(PP):
     -Passport is garbage? So here are 2 things that PP doesn't do well
	   1) while it does help us with the google-OATH flow, it does require us to kind of reach in
	   to some very specific points in the flow and add a little bit of code to get it to work
	   nicely. So, PP does automate a vast majority of the OAUTH flow, just not the entire thing
	   2) Just the  inherent confusion of how the library is structured. So, let it be know that
	   when we make use of passport we are making use of 2 different libraries, these:
	     -'passport': made up of general helpers for handling auth in Express apps
		 -'passport strategy':(at least one PP strategy) helpers for authentication with one very specific
		 method(email/password, google, facebook, etc)
      -strategies are is a module that helps you authenticate with one very specific provider
   -
   -
*/

/* since we aren't assigning anything to the passportConfig we only need to import
it as a require*/


// NOTES: cookieSession:
/*  -In app.use(cookieSession()); we need to add the maxAge of the cookie as miliseconds so it breaks down like
	this:
	  -30days * 24hrs * 60minutes * 60seconds * 1000miliseconds

	-Cookie Authentication:
	 -
*/
