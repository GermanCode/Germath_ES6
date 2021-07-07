import express from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from '../lib/auth';

const router = express.Router();

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup',{
        successRedirect: '/auth/profile',
        failureReditect: '/auth/signup', 
        failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/auth/profile',
        failureRedirect: '/auth/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/auth/signin');
});

module.exports = router;