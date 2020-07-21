const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('landing');
});

//AUTH ROUTES

//show register form
router.get('/register', (req, res) => {
    res.render('register');
});

//handle signup logic
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//handle login logic - login, middleware, callback
router.post('/login', passport.authenticate('local', 
{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
})

//logout logic
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out.');
    res.redirect('/campgrounds');
})

module.exports = router;