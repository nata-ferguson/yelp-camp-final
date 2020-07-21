require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const User = require('./models/user');
const Comment = require('./models/comment');
// const seedDB = require('./seeds');

//requring routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

//create a database in MondoDB locally
// mongoose.connect('mongodb://localhost: 27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://<user>:<password>@cluster0.spb11.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log("ERROR:", err.message);
});

app.use(bodyParser.urlencoded({extended: true})); //helps create object from the form input
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

//display date comment was created
app.locals.moment = require('moment');

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'YelpCamp secret phrase',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to display login, sign up and logout menu links correctly
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000);
