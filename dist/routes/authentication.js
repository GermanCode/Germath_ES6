"use strict";

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _auth = require("../lib/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/signup', _auth.isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});
router.post('/signup', _auth.isNotLoggedIn, _passport.default.authenticate('local.signup', {
  successRedirect: '/auth/profile',
  failureReditect: '/auth/signup',
  failureFlash: true
}));
router.get('/signin', _auth.isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});
router.post('/signin', _auth.isNotLoggedIn, (req, res, next) => {
  _passport.default.authenticate('local.signin', {
    successRedirect: '/auth/profile',
    failureRedirect: '/auth/signin',
    failureFlash: true
  })(req, res, next);
});
router.get('/profile', _auth.isLoggedIn, (req, res) => {
  res.render('profile');
});
router.get('/logout', _auth.isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/auth/signin');
});
module.exports = router;