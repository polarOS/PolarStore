const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const App = require('./src/models/App.js');
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
        if(err) return res.render('error', { error: 'We couldn\'t load the apps on the database!' });
        res.render('index', { apps: apps });
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
        res.render('error', { error: 'Your post has failed to be created!' });
        return;
    }

    await App.create({
        name: req.body.name,
        download: req.body.download,
        logo: req.body.icon,
        version: req.body.version,
        description: req.body.description,
        rating: 0,
        author: 'in-dev',
        compatibility: req.body.compatibility,
        language: req.body.language,
        maturityRating: req.body.maturityRating,
        category: req.body.category
    });

    res.redirect('/post-app?success=true');
    next();
});

app.listen(8000, () => {
    console.log('SUCCESS: Listening on port 8000')
});