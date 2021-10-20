const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const App = require('./src/models/App.js');
const req = require('express/lib/request');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected!');
}) .catch(err => console.log(err));

// Views

app.get('/', (req, res) => {
    App.find({}, (err, apps) => {
        if(err) return res.render('message', { error: true, message: 'We couldn\'t load the apps on the database!' });
        res.render('index', { apps: apps });
    });
});

app.get('/apps/:id', (req, res) => {
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
        res.render('app', { app: app });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/post-app', (req, res) => {
    if(req.query.success == 'true') {
        res.render('post-app', { success: true });
        return;
    }

    res.render('post-app', { success: false });
});

// API
// Logging in/registration - PolarID will be linked with this. Leave blank

app.post('/api/users/register', async (req, res) => {
    console.log(req.body);
});

app.post('/api/users/login', (req, res) => {
    console.log(req.body);
});

// Apps

app.post('/api/apps/post', async(req, res, next) => {
    if(req.body.name == undefined || req.body.version == undefined || req.body.name.length > 24 || req.body.version.length > 5) {
        res.render('message', { error: true, message: 'Your post has failed to be created!' });
        return;
    }

    await App.create({
        name: req.body.name,
        download: req.body.download,
        logo: req.body.icon,
        version: req.body.version,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        likes: 0,
        dislikes: 0,
        author: 'in-dev',
        authorId: 'in-dev',
        compatibility: req.body.compatibility,
        language: req.body.language,
        maturityRating: req.body.maturityRating,
        category: req.body.category
    });

    res.redirect('/post-app?success=true');
    next();
});

app.post('/api/apps/:id/open', async(req, res, next) => {
    res.redirect(`/apps/${req.params.id}`);
    next();
});

app.post('/api/apps/like', async(req, res, next) => {
    // Check if account has already liked, somehow...
    res.redirect(`/apps/${req.params.id}`);
    next();
});

app.post('/api/apps/:id/delete', async(req, res, next)  => {
    /* CHECK IF LOGGED IN & IF USER IS AUTHOR OR ADMIN */
    App.findOneAndDelete({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
        
        res.render('message', { error: false, message: `Successfully removed the application, ${app.name}!` });
        next();
    });
});

app.listen(8000, () => {
    console.log('SUCCESS: Listening on port 8000')
});