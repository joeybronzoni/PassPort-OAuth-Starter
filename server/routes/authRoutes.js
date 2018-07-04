// Lib imports
const passport = require('passport');

// Local imports

module.exports = app => {

  // auth route handlers
  // the GoogleStrategy has an internal identifier of 'google'hence th arg here *refer to keys.js
  app.get(
	'/auth/google',
	passport.authenticate('google', {
	  scope: ['profile', 'email']
	})
  );

  /* note instead of passing an arrow function we pass it off to passport to handle the
	 heavy lifting, just like in the previous route handler
  */
  app.get('/auth/google/callback',
	passport.authenticate('google')
  );

  app.get('/api/logout', (req,res) => {
	req.logout();
	res.send(req.user);
  });

  app.get('/api/current_user', (req,res) => {
	console.log('req.user: ', req.user);
	res.send(req.user);
  });

};
