const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Mongoose Stuff
module.exports.connection = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

this.connection.then(() => console.log('Connected to database!')) .catch(err => console.log(err));

const App = require('./models/App');

// Middleware
app.use(passport.initialize());

// Strategies
require('./api/auth/strategies/Discord');

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.session());

// Views
app.get('/', async (req, res) => {
    App.find({}, (err, apps) => {
        if(err) return res.render('message', { error: true, message: 'We couldn\'t load the apps on the database!' });
        res.render('index', { apps: apps, user: req.user });
    });
});

app.get('/apps/:id', (req, res) => {
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
        res.render('app', { app: app, user: req.user });
    });
});

app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error });
});

app.get('/post-app', (req, res) => {
    if(req.query.success == 'true') {
        res.render('post-app', { success: true });
        return;
    }

    res.render('post-app', { success: false });
});

// API
app.use('/api/auth', require('./api/auth/auth.js'));
app.use('/api/apps', require('./api/apps'));

app.listen(8000, () => {
    console.log('SUCCESS: Listening on port 8000, http://localhost:8000')
});