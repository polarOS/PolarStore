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
const User = require('./models/User');

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
    const { newAccount } = require('./api/auth/strategies/Discord');
    const { send } = require('./utils/mail');

    if(req.user && newAccount == true) {
        send({
            sender: 'PolarStore',
            reciever: req.user.email,
            subject: '👋 Welcome to PolarStore',
            body_text:
                '😎 You\'re now a member of PolarStore, how\'s it feel to be that cool?\n\n' +
                '💗 We\'re glad you joined us on this community. Here\'s a quick guide on what you can do:\n' +
                '\t- You can post apps, it\'s very easy to - as well!\n' +
                '\t- You can edit your prefrences! Some prefrences may even be globally saved.\n' +
                '\t- You can like and dislike posts, contributing to the community.\n\n' +
                '👉 Remember that PolarStore is still in beta and you should expect bugs. Report bugs at the Discord.'
        });
    }

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

app.get('/users/:id', async (req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!user) return res.render('message', { error: true, message: 'Unable to find the specified user!' });
    res.render('user', { profile: user, user: req.user });
});

app.get('/users/:id/prefrences', async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect(`/`);
    }

    const user = await User.findOne({discordId: req.params.id});
    if(req.user.discordId != user.discordId) return res.redirect(`/users/${req.params.id}`);
    res.render('prefrences', { profile: user, user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error });
});

app.get('/post-app', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/');
    }

    if(req.query.success == 'true') {
        res.render('post-app', { success: true });
        return;
    }

    res.render('post-app', { success: false });
});

// API
app.use('/api/auth', require('./api/auth/auth.js'));
app.use('/api/users', require('./api/users'));
app.use('/api/apps', require('./api/apps'));

app.listen(8000, () => {
    console.log(`SUCCESS: Listening on port 8000, http://localhost:8000`)
});